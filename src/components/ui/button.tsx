import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { LoaderCircle } from "lucide-react"
import type { ReactNode } from "react"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg border border-transparent bg-clip-padding font-[var(--font-body)] text-sm font-semibold whitespace-nowrap outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 disabled:transform-none disabled:transition-none disabled:shadow-none disabled:hover:translate-y-0 disabled:hover:scale-100 disabled:active:scale-100 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground",
        primary: "border-transparent bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground",
        outline:
          "border-secondary bg-transparent text-secondary hover:bg-secondary hover:text-secondary-foreground dark:border-border dark:text-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground dark:ring-1 dark:ring-white/15",
        ghost:
          "border-transparent bg-transparent text-secondary hover:bg-primary hover:text-primary-foreground dark:text-foreground",
        success:
          "border-transparent bg-success text-success-foreground hover:bg-secondary hover:text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-secondary hover:text-secondary-foreground",
        link: "border-transparent bg-transparent text-secondary underline-offset-4 hover:text-primary hover:underline",
      },
      interaction: {
        standard:
          "motion-safe:transition-[background-color,color,border-color,transform,box-shadow] motion-safe:duration-300 motion-safe:ease-in-out motion-safe:hover:-translate-y-[3px] motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.97] hover:shadow-md",
        compact:
          "motion-safe:transition-[background-color,color,border-color,transform,box-shadow] motion-safe:duration-300 motion-safe:ease-in-out motion-safe:hover:-translate-y-0.5 motion-safe:hover:scale-[1.01] motion-safe:active:scale-[0.98] hover:shadow-sm",
        none: "transition-none shadow-none",
      },
      size: {
        default:
          "min-h-10 gap-2 px-4",
        xs: "min-h-7 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        sm: "min-h-9 gap-1.5 rounded-[min(var(--radius-md),12px)] px-3 text-[0.8rem] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3.5",
        lg: "min-h-12 gap-2.5 px-6 text-base",
        icon: "size-10",
        "icon-xs":
          "size-7 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-8 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      interaction: "standard",
    },
    compoundVariants: [
      { variant: "link", className: "transition-none shadow-none" },
    ],
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  interaction = "standard",
  loading = false,
  disabled,
  children,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants> & {
  loading?: boolean
  children?: ReactNode
}) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      className={cn(buttonVariants({ variant, size, interaction, className }))}
      {...props}
    >
      {loading ? <LoaderCircle aria-hidden="true" className="motion-safe:animate-spin" /> : null}
      {loading ? <span>{children}</span> : children}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
