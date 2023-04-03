import React, { useEffect, useState } from "react";
import SubmitButton from "../SubmitButton";
import FormControl from "@mui/material/FormControl";
import StyledTextField from "../StyledTextField";
import { postUser } from "../../Services/users";
import { useRecoilState } from "recoil";
import {
  allUsersState,
  appState,
  modalState,
  userState,
} from "../../globalstate";
import { MenuItem, Select } from "@mui/material";

const AddUserModal = () => {
  const [app] = useRecoilState(appState);
  const [user] = useRecoilState(userState);
  const [modal, setModal] = useRecoilState(modalState);
  const [users, setUsers] = useRecoilState(allUsersState);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [isSamePassword, setIsSamePassword] = useState(false);
  const [isValidPhone, setIsValidPhone] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const PHONE_REGEX = /^([+]\d{2})?\d{10}$/;

  useEffect(() => {
    firstName.length === 0 ||
    lastName.length === 0 ||
    email.length === 0 ||
    phone.length === 0 ||
    username.length === 0 ||
    password.length === 0 ||
    confirmPassword.length === 0
      ? setIsEmpty(true)
      : setIsEmpty(false);
  }, [firstName, lastName, email, phone, username, password, confirmPassword]);

  useEffect(() => {
    password === confirmPassword
      ? setIsSamePassword(true)
      : setIsSamePassword(false);
  }, [password, confirmPassword]);

  useEffect(() => {
    phone.match(PHONE_REGEX) ? setIsValidPhone(true) : setIsValidPhone(false);
  }, [phone]);

  async function handleSubmit() {
    setAttemptedSubmit(true);
    if (isEmpty || !isSamePassword) return;
    const addUserRequestDto = {
      user: {
        credentials: {
          username: username,
          password: password,
        },
        profile: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: phone.replaceAll("-", ""),
        },
        admin: isAdmin,
      },
      credentials: {
        username: user.username,
        password: user.password,
      },
    };
    //console.log(addUserRequestDto);
    const response = await postUser(app.viewCompanyId, {
      ...addUserRequestDto,
    });
    setUsers([...users, response]);
    setModal({ isOpen: false, type: "", data: {} });
  }

  const selectStyle = {
    backgroundColor: "white",
    borderRadius: "6px",
    fontSize: "1.4rem",
    minWidth: "120px",
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    width: "clamp(20vw, 300px, 90vw)",
    padding: "30px 30px 50px 30px",
  };

  return (
    <div className="modal-body">
      <h2 style={{ fontWeight: 300 }}>Add new user</h2>
      <FormControl style={formStyle}>
        <div className="modal-row">
          <StyledTextField
            variant="standard"
            id="user-first-name-input"
            label="*First Name"
            error={attemptedSubmit && firstName.length === 0}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <StyledTextField
            variant="standard"
            id="user-last-name-input"
            label="*Last Name"
            error={attemptedSubmit && lastName.length === 0}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <StyledTextField
          type="email"
          variant="standard"
          id="user-email-input"
          label="*Email"
          error={attemptedSubmit && email.length === 0}
          onChange={(e) => setEmail(e.target.value)}
        />
        <StyledTextField
          type="tel"
          variant="standard"
          id="user-phone-input"
          label="*Phone Number"
          error={attemptedSubmit && (phone.length === 0 || !isValidPhone)}
          onChange={(e) => setPhone(e.target.value)}
        />
        <StyledTextField
          variant="standard"
          id="user-username-input"
          label="*Username"
          error={attemptedSubmit && username.length === 0}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div className="modal-row">
          <StyledTextField
            type="password"
            variant="standard"
            id="user-password-input"
            label="*Password"
            error={attemptedSubmit && password.length === 0}
            helperText={
              attemptedSubmit && password.length === 0
                ? "Password required."
                : " "
            }
            onChange={(e) => setPassword(e.target.value)}
          />
          <StyledTextField
            type="password"
            variant="standard"
            id="user-confirm-password-input"
            label="*Confirm Password"
            error={
              (attemptedSubmit && confirmPassword.length === 0) ||
              !isSamePassword
            }
            helperText={!isSamePassword ? "Password must be the same." : " "}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {/*<label>Make user an admin role?</label>
            <select>
                <option value="" disabled selected hidden>Pick an option</option>
                <option>true</option>
                <option>false</option>
            </select>*/}
        <h3>Make user an admin role?</h3>
        <Select
          value={isAdmin}
          onChange={(e) => {
            setIsAdmin(e.target.value);
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
      </FormControl>
      <SubmitButton handleSubmit={handleSubmit} />
    </div>
  );
};

export default AddUserModal;
