import { useState } from "react";
import { api } from "../api";

function ProjectForm({ onSuccess, editingProject }) {
  const [name, setName] = useState(editingProject?.name || "");
  const [description, setDescription] = useState(editingProject?.description || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingProject) {
      await api.put(`/projects/${editingProject.id}`, { name, description });
    } else {
      await api.post("/projects", { name, description });
      // axios.post("http://localhost:8000/projects", data)

    }
    onSuccess();
    setName("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        className="w-full border p-2"
        placeholder="Project Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        className="w-full border p-2"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button className="bg-green-600 text-white px-4 py-2 rounded">
        {editingProject ? "Update" : "Create"} Project
      </button>
    </form>
  );
}

export default ProjectForm;
