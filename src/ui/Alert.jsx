
import React from "react"

export function Alert({ children, variant = "default", className = "" }) {
  const variants = {
    default: "bg-gray-100 text-gray-700 border border-gray-200",
    destructive: "bg-red-100 text-red-800 border border-red-300",
    success: "bg-green-100 text-green-800 border border-green-300",
  }

  return (
    <div
      className={`w-full px-4 py-3 rounded-md text-sm ${variants[variant]} ${className}`}
    >
      {children}
    </div>
  )
}

export function AlertDescription({ children, className = "" }) {
  return <p className={`leading-relaxed ${className}`}>{children}</p>
}
