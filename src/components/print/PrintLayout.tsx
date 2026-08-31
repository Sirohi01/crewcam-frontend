import React from "react";

interface PrintLayoutProps {
  children: React.ReactNode;
}

export default function PrintLayout({ children }: PrintLayoutProps) {
  return (
    <>
      <div className="print-layout">
        {children}
      </div>

    </>
  );
}
