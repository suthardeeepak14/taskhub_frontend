import React from "react"

export function Avatar({ className = "", children }) {
  return (
    <div className={`relative inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-700 font-medium text-sm ${className}`}>
      {children}
    </div>
  )
}
export function AvatarFallback({ children }) {
  return <span>{children}</span>
}
