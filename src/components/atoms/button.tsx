import { cloneElement, isValidElement, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/cn";

export const buttonVariants = tv({
  base: "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  variants: {
    variant: {
      primary: "bg-primary text-primary-foreground hover:bg-[#333333]",
      secondary: "border border-border bg-card text-foreground hover:bg-muted",
      ghost: "text-foreground hover:bg-muted",
      destructive: "bg-destructive text-destructive-foreground hover:bg-red-600",
    },
    size: {
      sm: "h-8 px-3 text-[13px]",
      md: "h-9 px-4",
      lg: "h-11 px-5",
      icon: "size-9",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

export type ButtonProps = ComponentPropsWithoutRef<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    children?: ReactNode;
  };

/**
 * Native button atom. It intentionally avoids UI libraries and accepts every
 * standard `<button>` prop, including `className`, `type`, and ARIA attributes.
 */
export function Button(props: ButtonProps) {
  const { asChild, children, className, variant, size, ...nativeProps } = props;
  const classes = cn(buttonVariants({ variant, size }), className);

  if (asChild) {
    if (!isValidElement<{ className?: string }>(children)) return null;

    return cloneElement(children, {
      ...(nativeProps as Partial<{ className?: string }>),
      className: cn(classes, children.props.className),
    });
  }

  const { type = "button", ...buttonProps } = nativeProps;

  return <button className={classes} type={type} {...buttonProps}>{children}</button>;
}
