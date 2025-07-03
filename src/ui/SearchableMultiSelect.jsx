import { useState } from "react";
import { Input } from "./Input";

export function SearchableMultiSelect({ options, selected, onChange }) {
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  const toggleUser = (username) => {
    if (selected.includes(username)) {
      onChange(selected.filter((u) => u !== username));
    } else {
      onChange([...selected, username]);
    }
  };

  return (
    <div className="space-y-2">
      <Input
        autoFocus
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="max-h-40 overflow-y-auto border rounded p-2 bg-white">
        {filteredOptions.map((user) => (
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
        ))}
      </div>
    </div>
  );
}
