// components/ui/card.jsx
import React from "react"

export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className = "" }) {
  return <div className={`px-6 pt-6 ${className}`}>{children}</div>
}

export function CardTitle({ children, className = "" }) {
  return (
    <h2 className={`text-xl font-semibold text-gray-900 ${className}`}>
      {children}
    </h2>
  )
}

export function CardDescription({ children, className = "" }) {
  return <p className={`text-sm text-gray-500 mt-1 ${className}`}>{children}</p>
}

export function CardContent({ children, className = "" }) {
  return <div className={`px-6 pb-6 pt-4 ${className}`}>{children}</div>
}
