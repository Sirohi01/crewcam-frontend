import React from 'react';
import { cn } from '@/lib/utils';

interface LetterGenerateButtonProps {
  text: string;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'default' | 'ghost';
}

const LetterGenerateButton: React.FC<LetterGenerateButtonProps> = ({
  text,
  onClick,
  className,
  disabled = false,
  loading = false,
  variant = 'default',
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        // base
        "relative inline-flex items-center justify-center",
        "h-8 px-3",
        "border-none cursor-pointer overflow-hidden",
        "text-white text-[12px] font-bold tracking-[0.07em] uppercase",
        "transition-all duration-150 ease-out",

        // square shape
        "rounded-[4px]",

        // default variant
        variant === 'default' && [
          "bg-[#0d3c68]",
          "shadow-[0_2px_8px_rgba(13,60,104,0.25)]",
          "hover:bg-[#114d82]",
          "active:bg-[#0a2e52]",
        ],

        // ghost variant
        variant === 'ghost' && [
          "bg-white/15 border border-white/20",
          "hover:bg-white/25",
        ],

        // disabled / loading
        (disabled || loading) &&
          "opacity-45 cursor-not-allowed pointer-events-none",

        className
      )}
    >
      {loading ? (
        <svg
          className="animate-spin"
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,0.9)"
          strokeWidth={2}
          strokeLinecap="round"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            strokeDasharray="32"
            strokeDashoffset="10"
          />
        </svg>
      ) : null}

      {loading ? 'Generating…' : text}
    </button>
  );
};

export default LetterGenerateButton;