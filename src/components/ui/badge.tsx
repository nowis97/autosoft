import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-blue-600 text-white shadow-2xs",
        secondary: "border-slate-200 bg-slate-100 text-slate-800",
        destructive: "border-transparent bg-red-600 text-white shadow-2xs",
        outline: "text-slate-950 border-slate-300 bg-white/80",
        available: "border-emerald-200/80 bg-emerald-50 text-emerald-800 font-bold",
        reserved: "border-amber-200/80 bg-amber-50 text-amber-800 font-bold",
        sold: "border-slate-200 bg-slate-100 text-slate-600 font-semibold",
        maintenance: "border-orange-200/80 bg-orange-50 text-orange-800 font-bold",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {variant === "available" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />}
      {variant === "reserved" && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />}
      {variant === "maintenance" && <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />}
      {variant === "sold" && <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />}
      <span>{children}</span>
    </div>
  );
}

export { Badge, badgeVariants };
