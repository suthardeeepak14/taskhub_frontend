import { useRef, useState, useEffect } from "react"

export function DropdownMenu({ trigger, children }) {
  const [open, setOpen] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative inline-block" ref={ref}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          {children}
        </div>
      )}
    </div>
  )
}

export function DropdownMenuItem({ children, onClick }) {
  return (
    <div
      onClick={onClick}
      className="px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer"
    >
      {children}
    </div>
  )
}
