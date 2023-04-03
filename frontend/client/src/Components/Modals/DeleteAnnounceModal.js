import React from "react";
import { useRecoilState } from "recoil";
import { announcementsState, modalState } from "../../globalstate";
import { deleteAnnouncement } from "../../Services/announcements";

const DeleteAnnounceModal = ({ closeModal }) => {
  const [announcements, setAnnouncements] = useRecoilState(announcementsState);
  const [modal] = useRecoilState(modalState);

  const { id, credentials } = modal.data;

  function handleClick(e) {
    e.preventDefault();
    deleteAnnouncement(id, credentials).then((res) => {
      const filteredAnnouncements = announcements.filter(
        (announcement) => announcement.id !== id
      );
      setAnnouncements(filteredAnnouncements);
      //console.log("Deleted announcement:", res);
    });
    closeModal(e);
  }

  return (
    <div className="modal-body delete-announce">
      <h2 style={{ fontWeight: 300 }}>Delete Announcement</h2>
      <p>Are you sure? This cannot be undone.</p>
      <button className="announce-delete-btn" onClick={handleClick}>
        Confirm
      </button>
    </div>
  );
};

export default DeleteAnnounceModal;
