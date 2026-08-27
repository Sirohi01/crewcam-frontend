'use client';
import React, { useRef, useState, useCallback } from 'react';
import { Camera, RefreshCw, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WebcamCaptureProps {
  label?: string;
  initialImage?: string | null;
  captureImage: (image: string | null) => void;
  className?: string;
}

export const WebcamCapture: React.FC<WebcamCaptureProps> = ({
  label,
  initialImage,
  captureImage,
  className
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(initialImage || null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(!!initialImage);

  // Update state if initialImage changes (e.g. when editing a different record)
  React.useEffect(() => {
    setCapturedImage(initialImage || null);
    setIsConfirmed(!!initialImage);
    setIsCameraOpen(false);
  }, [initialImage]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      setStream(mediaStream);
      setIsCameraOpen(true);
      setIsConfirmed(false);
    } catch (err) {
      console.error("Error accessing webcam:", err);
      alert("Could not access camera. Please check permissions.");
    }
  };

  // Sync stream to video element when it mounts
  React.useEffect(() => {
    if (isCameraOpen && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
          track.enabled = false;
        });
      }
    };
  }, [isCameraOpen, stream]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    // Note: We don't set setIsCameraOpen(false) here because we want to show the preview
  }, [stream]);

  const capture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Use higher internal resolution for capture
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;

      const ctx = canvas.getContext('2d', { alpha: false });
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Use maximum JPEG quality (1.0)
        const imageSrc = canvas.toDataURL('image/jpeg', 1.0);
        setCapturedImage(imageSrc);
        stopCamera();
      }
    }
  };

  const confirmImage = () => {
    if (capturedImage) {
      captureImage(capturedImage);
      setIsConfirmed(true);
      setIsCameraOpen(false);
    }
  };

  const reset = () => {
    setCapturedImage(null);
    captureImage(null);
    setIsConfirmed(false);
    startCamera();
  };

  const closeCamera = () => {
    stopCamera();
    setIsCameraOpen(false);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <label className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">{label}</label>}

      <div className="relative group w-32 md:w-36">
        {/* Double Border Decorative Container */}
        <div className="absolute -inset-1 border-[3px] border-double border-slate-200 rounded-[4px] pointer-events-none group-hover:border-[#0d3c68]/30 transition-colors" />

        {!capturedImage && !isCameraOpen && (
          <button
            type="button"
            onClick={startCamera}
            className="relative w-full aspect-[3.5/4.5] bg-slate-50/50 border border-slate-200 rounded-[2px] flex flex-col items-center justify-center gap-3 hover:bg-white hover:border-[#0d3c68] transition-all group/btn overflow-hidden"
          >
            {/* Viewfinder Corners */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-slate-300 group-hover/btn:border-[#0d3c68]" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-slate-300 group-hover/btn:border-[#0d3c68]" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-slate-300 group-hover/btn:border-[#0d3c68]" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-slate-300 group-hover/btn:border-[#0d3c68]" />

            <div className="bg-white p-2 rounded-full shadow-sm border border-slate-100 group-hover/btn:scale-110 transition-transform">
              <Camera className="h-5 w-5 text-slate-400 group-hover/btn:text-[#0d3c68]" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover/btn:text-[#0d3c68]">Open Camera</span>
          </button>
        )}

        {isCameraOpen && !capturedImage && (
          <div className="relative rounded-[2px] overflow-hidden border border-slate-200 bg-black aspect-[3.5/4.5] flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-3 scale-90">
              <button
                type="button"
                onClick={capture}
                className="bg-[#0d3c68] text-white p-2.5 rounded-full shadow-xl hover:bg-[#0a2e50] transition-all ring-2 ring-white/50"
                title="Capture Image"
              >
                <div className="h-4 w-4 rounded-full border-2 border-white" />
              </button>
              <button
                type="button"
                onClick={closeCamera}
                className="bg-red-600 text-white p-2.5 rounded-full shadow-xl hover:bg-red-700 transition-all ring-2 ring-white/50"
                title="Cancel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {capturedImage && (
          <div className="relative rounded-[2px] overflow-hidden border border-slate-300 aspect-[3.5/4.5] shadow-md">
            <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
            <div className={cn(
              "absolute top-2 right-2 flex flex-col gap-2 scale-90 origin-top-right transition-all duration-300",
              isConfirmed ? "opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0" : "opacity-100"
            )}>
              {!isConfirmed && (
                <button
                  type="button"
                  onClick={reset}
                  className="bg-white/95 backdrop-blur-sm text-slate-700 p-2 rounded shadow-lg hover:bg-white transition-all border border-slate-200"
                  title="Retake"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              )}

              {!isConfirmed ? (
                <button
                  type="button"
                  onClick={confirmImage}
                  className="bg-green-600 text-white p-2 rounded shadow-lg border border-green-500 flex items-center justify-center hover:bg-green-700 transition-all"
                  title="Confirm & Use Photo"
                >
                  <Check className="h-4 w-4" />
                </button>
              ) : (
                <div className="bg-green-600/90 text-white px-2 py-1.5 rounded shadow-lg border border-green-500 flex items-center gap-1.5 backdrop-blur-sm">
                  <Check className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Saved</span>
                </div>
              )}

              {isConfirmed && (
                <button
                  type="button"
                  onClick={reset}
                  className="bg-white/95 backdrop-blur-sm text-slate-700 p-2 rounded shadow-lg hover:bg-white transition-all border border-slate-200 flex items-center justify-center"
                  title="Change Photo"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};
