"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// -----------------------------------------------------------------
// FormInput — reusable input field used across all pages
// Variants:
//   "default"  → rounded-md, h-6, border-[#e0e4eb]  (org-setup forms)
//   "hiring"   → rounded-none, h-8, border-zinc-200  (hiring / job forms)
//   "compact"  → rounded-none, h-7, border-zinc-200  (candidate forms)
//   "search"   → rounded-md, h-8, border-zinc-200    (search bars)
// -----------------------------------------------------------------

export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "hiring" | "compact" | "search";
}

const variantClasses: Record<NonNullable<FormInputProps["variant"]>, string> = {
  default:
    "mt-1 h-8 w-full rounded-md border border-zinc-200 bg-white px-2.5 text-[12px] text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50",
  hiring:
    "mt-1 h-8 w-full rounded-none border border-zinc-200 bg-white px-2.5 text-[11.5px] text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 disabled:cursor-not-allowed disabled:opacity-50",
  compact:
    "mt-1 h-7 w-full rounded-none border border-zinc-200 bg-white px-2 text-[11.5px] text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 disabled:cursor-not-allowed disabled:opacity-50",
  search:
    "h-8 w-full rounded-md border border-zinc-200 bg-white px-3 text-[12px] outline-none placeholder:text-zinc-400 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50",
};

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, variant = "default", type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(variantClasses[variant], className)}
        {...props}
      />
    );
  }
);

FormInput.displayName = "FormInput";

export { FormInput };
