import React from "react";

interface PrintHiringHeaderProps {
    title: string;
    subtitle?: string;
    refNo?: string;
    step?: number;
}

export default function PrintHiringHeader({
    title,
    subtitle,
    refNo,
    step,
}: PrintHiringHeaderProps) {
    return (
        <div style={{ position: "relative" }}>
            {step && (
                <div
                    style={{
                        textAlign: "right",
                        marginBottom: 6,
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#64748b",
                        letterSpacing: "0.04em",
                        textTransform: "uppercase"
                    }}
                >
                    Step {step}
                </div>
            )}

            {/* Company header image */}
            <div style={{ marginTop: 0, marginBottom: 12, width: "100%" }}>
                <img
                    src="/header.jpg"
                    alt="Company Header"
                    style={{
                        width: "100%",
                        height: "auto",
                        objectFit: "fill",
                        display: "block",
                        transform: "scaleY(1.08)",
                        transformOrigin: "bottom",
                    }}
                />
            </div>

            {/* Title row */}
            <div
                style={{
                    borderBottom: "2px solid #0f172a",
                    paddingBottom: 2,
                    marginBottom: 8,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                }}
            >
                {/* Title */}
                <h1
                    style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#ed7d31",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        margin: 0,
                    }}
                >
                    {title}
                </h1>

                {/* Ref No OR subtitle */}
                {refNo ? (
                    <span
                        style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: "#0f172a",
                        }}
                    >
                        Ref. No.&nbsp;&nbsp;{refNo}
                    </span>
                ) : subtitle ? (
                    <span
                        style={{
                            fontSize: 10,
                            fontWeight: 600,
                            color: "#64748b",
                            fontStyle: "italic",
                        }}
                    >
                        {subtitle}
                    </span>
                ) : null}
            </div>
        </div>
    );
}
