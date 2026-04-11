import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/presentation/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-brand-600 text-white hover:bg-brand-700 shadow-sm",
        secondary: "bg-brand-100 text-brand-700 hover:bg-brand-200 dark:bg-brand-900/50 dark:text-brand-300 dark:hover:bg-brand-800/60",
        outline: "border border-slate-200 bg-transparent hover:bg-slate-100 text-slate-700 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800",
        ghost: "hover:bg-slate-100 text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800",
        danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
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
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
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

export { Button, buttonVariants };
