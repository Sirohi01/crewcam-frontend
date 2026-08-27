'use client';
import { ReactNode, forwardRef, useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({ label, required, error, children, className }: FormFieldProps) {
  return (
    <div className={className}>
      <label className="block text-[11px] font-semibold text-black uppercase mb-0.5">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ error, className, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "w-full h-7 px-2 bg-white border text-[13px] transition-all duration-200",
          "placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0d3c68] focus:border-[#0d3c68]",
          error ? "border-red-500 bg-red-50/30" : "border-[#cbd5e1] hover:border-[#94a3b8]",
          className
        )}
        style={{ borderRadius: '2px' }}
        {...props}
        {...(type !== 'file' && props.value !== undefined ? { value: props.value } : {})}
      />
    );
  }
);

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ error, options, placeholder, className, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "w-full h-7 px-2 bg-white border text-[13px] transition-all duration-200 cursor-pointer",
          "focus:outline-none focus:ring-1 focus:ring-[#0d3c68] focus:border-[#0d3c68]",
          error ? "border-red-500 bg-red-50/30" : "border-[#cbd5e1] hover:border-[#94a3b8]",
          className
        )}
        style={{ borderRadius: '2px' }}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }
);

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ error, className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full px-3 py-1 bg-white border text-sm transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#0d3c68] focus:border-[#0d3c68] resize-none",
          error ? "border-red-500 bg-red-50/30" : "border-[#cbd5e1] hover:border-[#94a3b8]",
          className
        )}
        style={{ borderRadius: '2px' }}
        {...props}
      />
    );
  }
);

interface FormCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

export const FormCheckbox = forwardRef<HTMLInputElement, FormCheckboxProps>(
  ({ label, className, ...props }, ref) => {
    return (
      <label className={cn("flex items-center gap-2 cursor-pointer", className)}>
        <input
          ref={ref}
          type="checkbox"
          className="w-4 h-4 border border-[#cbd5e1] bg-white accent-[#0d3c68] focus:ring-1 focus:ring-[#0d3c68]"
          style={{ borderRadius: '2px' }}
          {...props}
        />
        <span className="text-xs font-semibold text-slate-700 uppercase">{label}</span>
      </label>
    );
  }
);

interface FormRadioGroupProps {
  name: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function FormRadioGroup({ name, options, value, onChange, className }: FormRadioGroupProps) {
  return (
    <div className={`flex flex-wrap gap-4 ${className || ''}`}>
      {options.map((option) => (
        <label key={option.value} className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange?.(e.target.value)}
            className="w-4 h-4 border border-input bg-background focus:ring-1 focus:ring-ring"
          />
          <span className="text-sm text-foreground">{option.label}</span>
        </label>
      ))}
    </div>
  );
}

interface SearchableSelectProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
  disabled?: boolean;
}

export function SearchableSelect({ options, value, onChange, placeholder = "Select...", className, error, disabled }: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={cn("relative w-full", className, disabled && "opacity-60 cursor-not-allowed")} ref={containerRef}>
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "w-full h-7 px-2 bg-white border text-[13px] flex items-center justify-between transition-all duration-200",
          disabled ? "bg-slate-50 border-slate-200 cursor-not-allowed" : "cursor-pointer hover:border-[#94a3b8]",
          isOpen ? "ring-1 ring-[#0d3c68] border-[#0d3c68]" : "border-[#cbd5e1]",
          error && "border-red-500 bg-red-50/30",
        )}
        style={{ borderRadius: '2px' }}
      >
        <span className={cn("truncate", !selectedOption && "text-slate-400")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={14} className={cn("text-slate-400 transition-transform", isOpen && "rotate-180")} />
      </div>

      {isOpen && (
        <div className="absolute z-[100] w-full mt-1 bg-white border border-slate-200 shadow-xl rounded-[2px] overflow-hidden animate-in fade-in zoom-in duration-150">
          <div className="p-1 border-b border-slate-50 bg-slate-50/50 flex items-center gap-2">
            <Search size={12} className="text-slate-400/70 ml-1" />
            <input
              autoFocus
              type="text"
              className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-[12px] p-1 placeholder:text-slate-400/60"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ul className="max-h-[200px] overflow-y-auto py-1 custom-scrollbar">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className={cn(
                    "px-3 py-1.5 text-[12.5px] cursor-pointer flex items-center justify-between transition-colors",
                    value === option.value ? "bg-[#0d3c68]/10 text-[#0d3c68] font-semibold" : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {value === option.value && <Check size={12} />}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-[12px] text-slate-400 italic">No results found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
