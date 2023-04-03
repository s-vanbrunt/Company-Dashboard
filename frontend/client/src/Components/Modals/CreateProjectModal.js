import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { appState, userState, projectsState } from "../../globalstate";
import SubmitButton from "../SubmitButton";
import StyledTextField from "../StyledTextField";
import { postProject } from "../../Services/projects";

const CreateProjectModal = ({ closeModal }) => {
  const [app] = useRecoilState(appState);
  const [user] = useRecoilState(userState);
  const [projects, setProjects] = useRecoilState(projectsState);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isEmpty, setIsEmpty] = useState(true);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  useEffect(() => {
    name.length === 0 || description.length === 0
      ? setIsEmpty(true)
      : setIsEmpty(false);
  }, [name, description]);

  async function handleSubmit(e) {
    setAttemptedSubmit(true);
    if (isEmpty) return;
    const response = await postProject(
      name,
      description,
      app.viewTeamId,
      user.username,
      user.password
    );
    setProjects([response, ...projects]);
    closeModal(e);
  }

  return (
    <div className="modal-body">
      <h2 style={{ fontWeight: 300 }}>Create new project</h2>
      <div className="modal-input-wrapper">
        <StyledTextField
          id="project-name-input"
          label="Project Name"
          variant="standard"
          error={attemptedSubmit && name.length === 0}
          onChange={(e) => setName(e.target.value)}
        />
        <StyledTextField
          id="description-input"
          label="Description"
          variant="standard"
          multiline
          error={attemptedSubmit && description.length === 0}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <SubmitButton handleSubmit={(e) => handleSubmit(e)} />
    </div>
  );
};

export default CreateProjectModal;
