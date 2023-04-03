import React, { useEffect } from "react";
import AddUserModal from "./Modals/AddUserModal";
import CreateAnnounceModal from "./Modals/CreateAnnounceModal";
import EditAnnounceModal from "./Modals/EditAnnounceModal";
import CreateProjectModal from "./Modals/CreateProjectModal";
import CreateTeamModal from "./Modals/CreateTeamModal";
import EditProjectModal from "./Modals/EditProjectModal";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import DeleteAnnounceModal from "./Modals/DeleteAnnounceModal";
import DeleteProjectModal from "./Modals/DeleteProjectModal";

const ModalContainer = ({ isOpen, type, closeModal }) => {
  function getModal() {
    switch (type) {
      case "add-user":
        return <AddUserModal />;
      case "create-announcement":
        return <CreateAnnounceModal closeModal={closeModal} />;
      case "edit-announcement":
        return <EditAnnounceModal closeModal={closeModal} />;
      case "delete-announcement":
        return <DeleteAnnounceModal closeModal={closeModal} />;
      case "create-project":
        return <CreateProjectModal closeModal={closeModal} />;
      case "edit-project":
        return <EditProjectModal closeModal={closeModal} />;
      case "delete-project":
        return <DeleteProjectModal closeModal={closeModal} />;
      case "create-team":
        return <CreateTeamModal closeModal={closeModal} />;
      default:
        return <>Invalid or empty modal type</>;
    }
  }
  let currentModal = getModal();

  useEffect(() => {
    isOpen ? (currentModal = getModal()) : (currentModal = <></>);
  }, [isOpen]);

  return (
    <div className="modal">
      <div className="modal-overlay" onClick={(e) => closeModal(e)}></div>
      <div className="modal-container">
        <span className="close-btn-wrapper">
          <HighlightOffIcon
            className="close-modal-btn"
            onClick={(e) => closeModal(e)}
          />
        </span>
        {currentModal}
      </div>
    </div>
  );
};

export default ModalContainer;
