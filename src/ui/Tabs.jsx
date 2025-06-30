import { useState, Children, cloneElement } from "react"

function cn(...classes) {
  return classes.filter(Boolean).join(" ")
}

export function Tabs({ defaultValue, className, children }) {
  const [activeTab, setActiveTab] = useState(defaultValue)

  const enhancedChildren = Children.map(children, (child) =>
    typeof child.type === "function"
      ? cloneElement(child, { activeTab, setActiveTab })
      : child
  )

  return <div className={cn("w-full", className)}>{enhancedChildren}</div>
}

export function TabsList({ className, children }) {
  return <div className={cn("flex gap-2 mb-4", className)}>{children}</div>
}

export function TabsTrigger({ value, activeTab, setActiveTab, className, children }) {
  const isActive = activeTab === value

  return (
    <button
      type="button"
      onClick={() => setActiveTab(value)}
      className={cn(
        "px-4 py-2 text-sm font-medium border rounded-md transition",
        isActive
          ? "bg-primary text-white border-primary"
          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100",
        className
      )}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, activeTab, className, children }) {
  if (value !== activeTab) return null

  return <div className={cn("mt-4", className)}>{children}</div>
}
