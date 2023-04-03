import React from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const ProjectCard = ({
  name,
  description,
  active,
  openEditModal,
  openDeleteModal,
  isAdmin,
}) => {
  const activity = active ? (
    <span className="active">Active</span>
  ) : (
    <span className="inactive">Inactive</span>
  );

  return (
    <div className="project-card">
      <div className="project-details">
        <span className="activity-wrapper">
          <span className="project-name">{name}</span>
          {activity}
        </span>
        <span className="project-description">{description}</span>
      </div>
      <div className="project-btn-wrapper">
        <button className="edit-btn" onClick={openEditModal}>
          Edit
        </button>
        {isAdmin && (
          <DeleteForeverIcon className="delete-btn" onClick={openDeleteModal} />
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
