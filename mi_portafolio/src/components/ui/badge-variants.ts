import { cva } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-white/10 bg-white/8 text-muted-foreground [a&]:hover:bg-white/15",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20",
        outline:
          "border-white/15 text-muted-foreground [a&]:hover:border-primary/40 [a&]:hover:text-primary",
        tech:
          "border-primary/20 bg-primary/10 text-primary rounded-full [a&]:hover:bg-primary/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export { badgeVariants };
