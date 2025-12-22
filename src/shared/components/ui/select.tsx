import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/utils/cn";

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "placeholder"> {
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options = [], placeholder, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          className={cn(
            "flex h-input w-full appearance-none rounded-input border border-neutral-300 bg-neutral-white px-space-16 py-space-12 pr-space-40 text-body-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-standard",
            className
          )}
          ref={ref}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.length > 0
            ? options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))
            : children}
        </select>
        <ChevronDown className="absolute right-space-12 top-1/2 h-5 w-5 -translate-y-1/2 transform pointer-events-none text-neutral-500" />
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };

