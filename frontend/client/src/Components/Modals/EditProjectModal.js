import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import SubmitButton from "../SubmitButton";
import { projectsState, userState } from "../../globalstate";
import { modalState } from "../../globalstate";
import FormControl from "@mui/material/FormControl";
import { Select, MenuItem } from "@mui/material";
import StyledTextField from "../StyledTextField";
import { patchProject } from "../../Services/projects";

const EditProjectModal = ({ closeModal }) => {
  const [projects, setProjects] = useRecoilState(projectsState);
  const [modal] = useRecoilState(modalState);
  const [form, setForm] = useState({ title: "", message: "" });
  const [select, setSelect] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [user] = useRecoilState(userState);

  const { id, title, message, active, teamObj } = modal.data;

  useEffect(() => {
    setForm({ title, message });
    setSelect(active);
  }, []);

  useEffect(() => {
    form.title.length === 0 || form.message.length === 0
      ? setIsEmpty(true)
      : setIsEmpty(false);
  }, [form.title, form.message]);

  function handleChange(e) {
    setForm({ ...form, [e.target.id]: e.target.value });
  }

  async function handleSubmit(e) {
    if (isEmpty) return;
    e.preventDefault();

    const response = await patchProject(
      id,
      form.title,
      form.message,
      select,
      teamObj,
      user.username,
      user.password
    );

    // update projects
    const newProjects = [...projects];
    const index = newProjects.findIndex((p) => p.id === id);
    newProjects[index] = response;
    setProjects(newProjects);

    closeModal(e);
  }

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "3rem",
    width: "300px",
    marginBottom: "2rem",
  };

  const selectStyle = {
    backgroundColor: "white",
    borderRadius: "6px",
    fontSize: "1.4rem",
    minWidth: "120px",
  };

  return (
    <div className="modal-body">
      <h2 style={{ fontWeight: 300, marginBottom: "2rem" }}>Edit project</h2>
      <FormControl style={formStyle}>
        <StyledTextField
          id="title"
          value={form.title}
          label="Project Name"
          variant="standard"
          onChange={handleChange}
        />
        <StyledTextField
          id="message"
          value={form.message}
          label="Description"
          variant="standard"
          multiline
          onChange={handleChange}
        />
        {user.isAdmin && (
          <>
            <h3> Active? </h3>
            <Select
              defaultValue={active}
              onChange={(e) => {
                setSelect(e.target.value);
              }}
              sx={selectStyle}
            >
              <MenuItem sx={{ fontSize: "1.4rem" }} value={true}>
                Yes
              </MenuItem>
              <MenuItem sx={{ fontSize: "1.4rem" }} value={false}>
                No
              </MenuItem>
            </Select>
          </>
        )}
      </FormControl>
      <SubmitButton handleSubmit={handleSubmit} />
    </div>
  );
};

export default EditProjectModal;
