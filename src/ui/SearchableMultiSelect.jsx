import { useState, useRef, useEffect } from "react";
import { Input } from "./Input";

export function SearchableMultiSelect({ options, selected, onChange }) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const filteredOptions = options.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  const toggleUser = (username) => {
    if (selected.includes(username)) {
      onChange(selected.filter((u) => u !== username));
    } else {
      onChange([...selected, username]);
    }
    setSearch(""); // Reset input after selection
    setOpen(false); // Close dropdown on select
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-2" ref={containerRef}>
      <Input
        placeholder="Search users..."
        value={search}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setSearch(e.target.value);
          setOpen(true);
        }}
      />

      {open && (
        <div className="max-h-40 overflow-y-auto border rounded p-2 bg-white z-10">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((user) => (
              <div
                key={user.id}
                className={`cursor-pointer px-2 py-1 rounded hover:bg-gray-100 ${
                  selected.includes(user.username)
                    ? "bg-primary/10 font-medium"
                    : ""
                }`}
                onClick={() => toggleUser(user.username)}
              >
                {user.username}
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500 px-2 py-1">
              No users found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
