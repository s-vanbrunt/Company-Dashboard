import { Avatar, Button, Grid, Paper, TextField } from "@mui/material";
import React from "react";
import { useRecoilState } from "recoil";
import logo from "../../Assets/logo.png";
import { Navigate } from "react-router-dom";
import { errorState, userState } from "../../globalstate";
import { login } from "../../Services/users";
import StyledTextField from "../../Components/StyledTextField";

const Login = () => {
  const [user, setUser] = useRecoilState(userState);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = useRecoilState(errorState);

  const handleLogin = async () => {
    if (username === "" || password === "") {
      setError({ isError: true, message: "Please fill out all fields" });
      return;
    }

    const response = await login(username, password).catch((err) => {
      setError({ isError: true, message: "Invalid username or password" });
    });

    if (!response) {
      setError({ isError: true, message: "No Response From Server" });
    } else if (response) {
      setError({ isError: false, message: "" });
      setUser({
        isLoggedIn: true,
        username,
        password,
        id: response.id,
        profile: response.profile,
        isAdmin: response.admin,
        active: response.active,
        status: response.status,
        companies: response.companies,
        teams: response.teams,
      });
    }
  };

  if (user.isLoggedIn) {
    return <Navigate replace to="/company" />;
  } else {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "50px",
          height: "100vh",
          padding: "50px 0",
          background: "#051622",
          color: "#1ba098",
        }}
      >
        <header style={headerStyle}>
          <Avatar style={avatarStyle} src={logo}></Avatar>
          <h1 style={{ margin: 0, fontWeight: 300 }}>COOK SYSTEMS</h1>
          <h2 style={{ fontSize: "2rem", fontWeight: 400 }}>A FINAL APP</h2>
        </header>
        <Paper elevation={10} style={paperStyle}>
          <StyledTextField
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ width: "50%" }}
            id="username"
            label="Username"
            placeholder="Enter username"
            type="text"
            variant="standard"
            autoComplete="off"
            required
          />
          <br />
          <StyledTextField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ width: "50%" }}
            label="Password"
            placeholder="Enter password"
            type="password"
            variant="standard"
            required
          />
          <br />
          <button
            className="login-btn"
            type="submit"
            color="primary"
            variant="contained"
            onClick={() => handleLogin()}
          >
            Login
          </button>
          {error.isError ? (
            <p style={{ color: "red", fontSize: "1.4rem", marginTop: "5px" }}>
              {error.message}
            </p>
          ) : null}
        </Paper>
      </div>
    );
  }
};

export default Login;

const headerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "10px",
};
const paperStyle = {
  justifyContent: "center",
  alignItems: "center",
  width: "clamp(30%, 400px, 90vw)",
  padding: "100px 0",
  color: "#1ba098",
  background: "#051622",
  border: "1px solid #deb992",
  borderRadius: "10px",
  display: "flex",
  flexDirection: "column",
};
const avatarStyle = {
  height: "100px",
  width: "100px",
};
