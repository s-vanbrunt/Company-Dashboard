import React from "react";
import { useRecoilState } from "recoil";
import { projectsState, modalState } from "../../globalstate";
import { deleteProject } from "../../Services/projects";

const DeleteProjectModal = ({ closeModal }) => {
  const [projects, setProjects] = useRecoilState(projectsState);
  const [modal] = useRecoilState(modalState);

  const { id, credentials } = modal.data;

  function handleClick(e) {
    e.preventDefault();
    deleteProject(id, credentials).then((res) => {
      const filteredProjects = projects.filter((p) => p.id !== id);
      setProjects(filteredProjects);
    });
    closeModal(e);
  }

  return (
    <div className="modal-body delete-announce">
      <h2 style={{ fontWeight: 300 }}>Delete Project</h2>
      <p>Are you sure? This cannot be undone.</p>
      <button className="announce-delete-btn" onClick={handleClick}>
        Confirm
      </button>
    </div>
  );
};

export default DeleteProjectModal;
