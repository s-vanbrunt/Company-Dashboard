import React, { useState } from "react";
import { useRecoilState } from "recoil";
import FormControl from "@mui/material/FormControl";
import StyledTextField from "../StyledTextField";
import SubmitButton from "../SubmitButton";
import { announcementsState, modalState } from "../../globalstate";
import { createAnnouncement } from "../../Services/announcements";

const CreateAnnounceModal = ({ closeModal }) => {
  const [announcements, setAnnouncements] = useRecoilState(announcementsState);
  const [modal] = useRecoilState(modalState);
  const [form, setForm] = useState({ title: "", message: "" });
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const { credentials, companyId } = modal.data;

  function handleChange(e) {
    setAttemptedSubmit(false);
    setForm({ ...form, [e.target.id]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setAttemptedSubmit(true);

    if (!form.title.length || !form.message.length) {
      return;
    }

    const requestObj = {
      credentials,
      title: form.title,
      message: form.message,
      companyId
    };

    createAnnouncement(requestObj).then(res => {
      setAnnouncements([...announcements, res]);
    });

    closeModal(e);
  }

  return (
    <div className="modal-body">
      <h2 style={{ fontWeight: 300 }}>Create new announcement</h2>
      <FormControl style={formStyle}>
        <StyledTextField
          id="title"
          value={form.title}
          label="title"
          variant="standard"
          error={attemptedSubmit && !form.title.length}
          onChange={handleChange}
        />
        <StyledTextField
          id="message"
          value={form.message}
          label="message"
          variant="standard"
          error={attemptedSubmit && !form.message.length}
          multiline
          onChange={handleChange}
        />
        <SubmitButton handleSubmit={handleSubmit} />
      </FormControl>
    </div>
  );
};

export default CreateAnnounceModal;

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  width: "clamp(20vw, 300px, 90vw)",
  padding: "30px 30px 50px 30px"
};
