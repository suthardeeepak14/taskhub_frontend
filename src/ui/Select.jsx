import { useState, Children, cloneElement } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

export function Select({ value, onValueChange, children }) {
  const [open, setOpen] = useState(false);

  const handleSelect = (val) => {
    onValueChange(val);
    setOpen(false);
  };

  const childrenWithProps = Children.map(children, (child) => {
    if (child.type === SelectTrigger) {
      return cloneElement(child, {
        onClick: () => setOpen((prev) => !prev),
      });
    }

    if (child.type === SelectContent) {
      return cloneElement(child, {
        open,
        onSelect: handleSelect,
      });
    }

    return child;
  });

  return <div className="relative">{childrenWithProps}</div>;
}

export function SelectTrigger({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex justify-between items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
    >
      {children}
      <ChevronDown className="w-4 h-4 ml-2" />
    </button>
  );
}

export function SelectValue({ value, placeholder }) {
  return (
    <span
      className={clsx("text-sm", value ? "text-gray-900" : "text-gray-700")}
    >
      {value || placeholder}
    </span>
  );
}

export function SelectContent({ children, open, onSelect }) {
  if (!open) return null;

  const items = Children.map(children, (child) => {
    return cloneElement(child, {
      onSelect, // ✅ Fix: pass the onSelect handler to each SelectItem
    });
  });

  return (
    <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200">
      <ul className="max-h-60 overflow-auto text-sm">{items}</ul>
    </div>
  );
}

export function SelectItem({ value, children, onSelect }) {
  return (
    <li
      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
      onClick={() => onSelect && onSelect(value)} // ✅ Safety check
    >
      {children}
    </li>
  );
}
