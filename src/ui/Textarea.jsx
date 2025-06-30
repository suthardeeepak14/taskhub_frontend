import React from "react"
import clsx from "clsx"

export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={clsx(
        "w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition",
        className
      )}
      {...props}
    />
  )
}
