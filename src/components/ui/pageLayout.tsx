import React from "react";

type PageLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

const PageLayout = ({ children, className = "" }: PageLayoutProps) => {
  return (
    <main
      className={`mx-auto max-w-[1600px] space-y-2 px-2 pb-4 sm:px-3 ${className}`}
    >
      {children}
    </main>
  );
};

export default PageLayout;