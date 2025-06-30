import { useEffect, useState } from "react";
import { api } from "../api";
import ProjectEditModal from "./ProjectEditModal";

const ProjectList = ({ onDelete }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchProjects = async () => {
    const res = await api.get("/getprojects");
    setProjects(res.data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleEditClick = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  return (
    <>
      <ul className="space-y-4">
        {projects.map((project) => (
          <li key={project.id} className="border p-4 rounded shadow">
            <div className="flex justify-between">
              <div>
                <h3 className="font-bold">{project.name}</h3>
                <p>{project.description}</p>
              </div>
              <div className="space-x-2">
                <button
                  className="bg-yellow-400 px-3 py-1 rounded text-sm"
                  onClick={() => handleEditClick(project)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                  onClick={() => onDelete(project.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <ProjectEditModal
        isOpen={showModal}
        onClose={handleModalClose}
        project={selectedProject}
        onUpdate={fetchProjects}
      />
    </>
  );
};

export default ProjectList;
