import clsx from "clsx"

export function Badge({ className = "", children, variant = "default", ...props }) {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium"
  const variants = {
    default: "bg-gray-100 text-gray-800",
    outline: "border border-gray-300 text-gray-700 bg-transparent",
  }

  const hasCustomColors = className.includes("bg-") || className.includes("text-");

  return (
    <span
      className={clsx(
        baseClasses,
        !hasCustomColors && variants[variant], 
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
