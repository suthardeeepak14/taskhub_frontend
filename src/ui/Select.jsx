import { useState, Children, cloneElement } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

// ✅ Main Select wrapper
export function Select({ value = "", onValueChange, children }) {
  const [open, setOpen] = useState(false);

  const handleSelect = (val) => {
    if (typeof onValueChange === "function") {
      onValueChange(val);
    }
    setOpen(false); // Close dropdown after selection
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
        selectedValue: value,
      });
    }

    return child;
  });

  return <div className="relative">{childrenWithProps}</div>;
}

// ✅ Trigger Button
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

// ✅ Value Display
export function SelectValue({ value, placeholder }) {
  return (
    <span
      className={clsx("text-sm", value ? "text-gray-900" : "text-gray-700")}
    >
      {value || placeholder}
    </span>
  );
}

// ✅ Dropdown Menu
export function SelectContent({ children, open, onSelect, selectedValue }) {
  if (!open) return null;

  const items = Children.map(children, (child) => {
    return cloneElement(child, {
      onSelect,
      selectedValue,
    });
  });

  return (
    <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200">
      <ul className="max-h-60 overflow-auto text-sm">{items}</ul>
    </div>
  );
}

// ✅ Each Selectable Item
export function SelectItem({ value, children, onSelect, selectedValue }) {
  const isSelected = value === selectedValue;

  return (
    <li
      className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${
        isSelected ? "bg-gray-200 font-semibold" : ""
      }`}
      onClick={() => onSelect(value)}
    >
      {children}
    </li>
  );
}
