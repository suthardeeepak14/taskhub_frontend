import React from "react"

export function Button({ children, variant = "default", size = "md", className = "", ...props }) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 cursor-pointer"

  const variantStyles = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 cursor-pointer",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-400",
  }

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
