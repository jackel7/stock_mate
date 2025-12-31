import { cn } from "@/lib/utils";

export function Button({ className, variant = "primary", size = "default", ...props }) {
  const variants = {
    primary: "bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 hover:-translate-y-0.5 focus:ring-brand-500 border border-transparent",
    secondary: "bg-white text-surface-900 border border-surface-200 shadow-sm hover:bg-surface-50 hover:border-surface-300 focus:ring-surface-200 hover:-translate-y-0.5",
    outline: "border-2 border-brand-200 text-brand-700 bg-transparent hover:bg-brand-50 hover:border-brand-300 focus:ring-brand-500",
    danger: "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:-translate-y-0.5 focus:ring-red-500",
    ghost: "hover:bg-surface-100 text-surface-600 hover:text-surface-900",
    link: "text-brand-600 underline-offset-4 hover:underline",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 text-xs",
    lg: "h-12 px-8 text-lg",
    icon: "h-10 w-10 p-2 flex items-center justify-center rounded-full",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
