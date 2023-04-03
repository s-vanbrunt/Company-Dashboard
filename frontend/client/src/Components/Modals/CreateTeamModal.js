import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { appState, userState, modalState, teamState } from "../../globalstate";
import SubmitButton from "../SubmitButton";
import { getCompanyUsers } from "../../Services/users";
import { postTeams } from "../../Services/teams";
import { FormControl, Select, MenuItem } from "@mui/material";
import StyledTextField from "../StyledTextField";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

const CreateTeamModal = () => {
  const [app] = useRecoilState(appState);
  const [user] = useRecoilState(userState);
  const [modal, setModal] = useRecoilState(modalState);
  const [teams, setTeams] = useRecoilState(teamState);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isEmpty, setIsEmpty] = useState(true);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  useEffect(() => {
    name.length === 0 || description.length === 0
      ? setIsEmpty(true)
      : setIsEmpty(false);
  }, [name, description]);

  useEffect(() => {
    const getAllUsers = async () => {
      const response = await getCompanyUsers(app.viewCompanyId);
      setAvailableUsers(response.data);
    };

    getAllUsers();
  }, []);

  const options = availableUsers.map((member) => (
    <MenuItem key={member.id} value={member.id} style={{ fontSize: "1.4rem" }}>
      {member.profile.firstName + " " + member.profile.lastName}
    </MenuItem>
  ));

  function handleChange(e) {
    //console.log(e);
    const selectedId = e.target.value;
    setSelectedUsers([
      ...selectedUsers,
      availableUsers.find((user) => {
        return user.id === selectedId;
      }),
    ]);
    setAvailableUsers(availableUsers.filter((user) => user.id !== selectedId));
  }

  function handleRemove(e) {
    //console.log(e);
    const selectedId = e.id;
    setAvailableUsers([
      ...availableUsers,
      selectedUsers.find((user) => {
        return user.id === selectedId;
      }),
    ]);
    setSelectedUsers(selectedUsers.filter((user) => user.id !== selectedId));
  }

  async function handleSubmit() {
    setAttemptedSubmit(true);
    if (isEmpty) return;
    const response = await postTeams(
      name,
      description,
      selectedUsers,
      [],
      user.username,
      user.password,
      app.viewCompanyId
    );
    setTeams([...teams, response]);
    setModal({ isOpen: false, type: "", data: {} });
  }

  return (
    <div className="modal-body create-team">
      <h2 style={{ fontWeight: 300 }}>Create Team</h2>
      <FormControl style={formStyle} size="small">
        <StyledTextField
          id="project-name-input"
          label="Team Name"
          variant="standard"
          error={attemptedSubmit && name.length === 0}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%" }}
        />
        <StyledTextField
          id="description-input"
          label="Description"
          variant="standard"
          multiline
          error={attemptedSubmit && description.length === 0}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: "100%" }}
        />
        <label
          style={{ fontSize: "2rem", color: "#deb992", marginTop: "20px" }}
          htmlFor="members"
        >
          Select Members
        </label>
        {availableUsers.length > 0 && (
          <Select
            name="members"
            value={""}
            onChange={(event) => handleChange(event)}
            sx={selectStyle}
          >
            {options}
          </Select>
        )}
      </FormControl>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "50px",
          width: "200px",
        }}
      >
        {selectedUsers.map((u) => (
          <div style={selectedUserStyle}>
            <div className="team-pill">
              <span key={u.id}>
                {u.profile.firstName + " " + u.profile.lastName[0] + "."}
              </span>
            </div>
            <HighlightOffIcon
              className="delete-member-icon"
              onClick={() => handleRemove(u)}
            />
          </div>
        ))}
      </div>

      <SubmitButton handleSubmit={handleSubmit} />
    </div>
  );
};

export default CreateTeamModal;

const formStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "20px",
  width: "clamp(20vw, 300px, 90vw)",
  padding: "30px",
};

const selectStyle = {
  width: "200px",
  backgroundColor: "white",
  borderRadius: "10px",
  fontSize: "1.6rem",
};

const selectedUserStyle = {
  display: "flex",
  alignItems: "center",
  gap: "5px",
};
