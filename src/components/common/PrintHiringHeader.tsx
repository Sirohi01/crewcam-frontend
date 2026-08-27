'use client';
interface PrintHiringHeaderProps {
    title: string;
    subtitle: string;
    step?: number;
}

export default function PrintHiringHeader({
    title,
    subtitle,
    step,
}: PrintHiringHeaderProps) {
    return (
        <div style={{ position: "relative" }}>
            {step && (
                <div
                    style={{
                        textAlign: "right",
                        marginBottom: 6,
                        marginTop: -16,   // Step 1 ko upar le jayega
                        fontSize: 10,
                        fontWeight: 600,
                        color: "#64748b",
                    }}
                >
                    Step {step}
                </div>
            )}
            <div
                style={{
                    marginTop: 0,
                    marginBottom: 12, // Header image ke niche gap
                    width: "100%",
                }}
            >
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

            <div
                style={{
                    borderBottom: "2px solid #0f172a",
                    paddingBottom: 2,
                    marginBottom: 8, // 1. DEPARTMENT DETAILS ko upar laye
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                }}
            >
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
            </div>
        </div>
    );
}