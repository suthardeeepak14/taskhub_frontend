import { useState, useEffect } from "react";
import { api } from "../api";

const ProjectEditModal = ({ isOpen, onClose, project, onUpdate }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description);
    }
  }, [project]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.put(`/projects/${project.id}`, { name, description });
    onUpdate(); 
    onClose();  
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">✏️ Edit Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full border p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Project Name"
            required
          />
          <textarea
            className="w-full border p-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Project Description"
            required
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectEditModal;
