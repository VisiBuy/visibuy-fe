import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-btn-medium font-medium transition-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary-blue text-neutral-white hover:bg-primary-blue/90 shadow-elevation-1",
        outline:
          "border border-primary-blue text-primary-blue bg-transparent hover:bg-primary-blue/10",
        ghost: "hover:bg-neutral-100 text-neutral-900",
        danger: "bg-danger text-neutral-white hover:bg-danger/90",
      },
      size: {
        default: "h-btn-medium px-btn-medium-x py-space-12 text-body-medium",
        sm: "h-btn-small px-btn-small-x py-space-8 text-body-small",
        lg: "h-btn-large px-btn-large-x py-space-16 text-body-large",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };

