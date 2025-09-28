import React from 'react';
import { cn } from '@/utils/formatters';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft hover:shadow-medium',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-soft hover:shadow-medium',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-soft hover:shadow-medium',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-soft hover:shadow-medium',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        success: 'bg-success text-success-foreground hover:bg-success/90 shadow-soft hover:shadow-medium',
        warning: 'bg-warning text-warning-foreground hover:bg-warning/90 shadow-soft hover:shadow-medium',
        gradient: 'gradient-primary text-white hover:opacity-90 shadow-soft hover:shadow-medium',
        'gradient-success': 'gradient-secondary text-white hover:opacity-90 shadow-soft hover:shadow-medium',
        'gradient-accent': 'gradient-accent text-white hover:opacity-90 shadow-soft hover:shadow-medium',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-lg px-8 text-base',
        xl: 'h-14 rounded-xl px-10 text-lg',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8 rounded-md',
        'icon-lg': 'h-12 w-12 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
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
Button.displayName = 'Button';

export { Button, buttonVariants };
