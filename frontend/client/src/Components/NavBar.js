import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import { appState, userState } from "../globalstate";
import { useRecoilState } from "recoil";
import {
  AppBar,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import logo from "../Assets/logo.png";

const NavBar = () => {
  const [app, setApp] = useRecoilState(appState);
  const [user, setUser] = useRecoilState(userState);
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const anchor = "top";
  const [toggled, setToggled] = React.useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const logOut = () => {
    setUser({});
    setApp({});
    navigate("/");
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
    setToggled(!toggled);
  };

  const list = () => (
    <Box
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List
        style={{ textAlign: "center", background: "#051622" }}
        sx={{ width: "100%" }}
      >
        {(user.isAdmin
          ? ["Home", "Company", "Teams", "Users"]
          : ["Home", "Teams"]
        ).map((text, index) => (
          <ListItem
            key={text}
            disablePadding
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              borderBottom: "1px solid rgba(27, 160, 152, 0.3)",
            }}
          >
            <Link
              to={
                text.toLowerCase() === "home"
                  ? "/announcements"
                  : "/" + text.toLowerCase()
              }
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItemButton sx={{ width: "100%" }}>
                <ListItemText
                  style={{ color: "#1ba098" }}
                  primary={text}
                  primaryTypographyProps={{ fontSize: "1.8rem" }}
                />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
        <ListItem
          key={"logout"}
          disablePadding
          sx={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <ListItemButton
            sx={{ width: "100%", textAlign: "center" }}
            onClick={logOut}
          >
            <ListItemText
              style={{ color: "#1ba098" }}
              primary="Logout"
              primaryTypographyProps={{ fontSize: "1.8rem" }}
            />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
    </Box>
  );

  if (isMobile) {
    return (
      <>
        <div
          style={{
            position: "relative",
            zIndex: "1500",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "8vh",
            color: "#1ba098",
            background: "#051622",
            padding: "0 1rem 0 2rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <img
              src={logo}
              alt="logo"
              style={{ display: "block", width: "40px", height: "40px" }}
            />
            <h1
              style={{
                color: "#F24E1E",
                fontSize: "2rem",
                fontWeight: "400",
              }}
            >
              {user.profile.firstName + " " + user.profile.lastName[0] + "."}
              {user.isAdmin && " | ADMIN"}
            </h1>
          </div>
          {toggled ? (
            <Button onClick={toggleDrawer(anchor, true)}>
              <MenuIcon
                style={{ height: "5vh", width: "5vw", color: "#1ba098" }}
              />
            </Button>
          ) : (
            <Button onClick={toggleDrawer(anchor, false)}>
              <CloseIcon
                style={{
                  height: "5vh",
                  width: "5vw",
                  color: "#1ba098",
                }}
              />
            </Button>
          )}
        </div>
        <Drawer
          sx={{ transform: anchor === "top" && "translateY(8vh)" }}
          anchor={anchor}
          open={state[anchor]}
          onClose={toggleDrawer(anchor, false)}
        >
          {list(anchor)}
        </Drawer>
      </>
    );
  } else
    return (
      <Box style={{ height: "90px", color: "#1ba098", background: "#051622" }}>
        <AppBar position="static" style={{ position: "static" }}>
          <Toolbar
            variant="dense"
            style={{
              background: "#051622",
              display: "flex",
              justifyContent: "space-between",
              height: "90px",
              padding: "0",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "2rem",
                marginLeft: "2rem",
              }}
            >
              <img
                src={logo}
                alt="logo"
                style={{ display: "block", width: "40px", height: "40px" }}
              />
              <h1
                style={{
                  color: "#F24E1E",
                  fontSize: "2rem",
                  fontWeight: "400",
                }}
              >
                {user.profile.firstName + " " + user.profile.lastName[0] + "."}
                {user.isAdmin && " | ADMIN"}
              </h1>
            </div>
            <List
              style={{ textAlign: "center", background: "#051622" }}
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                maxHeight: "70px",
              }}
            >
              {(user.isAdmin
                ? ["Home", "Company", "Teams", "Users"]
                : ["Home", "Teams"]
              ).map((text, index) => (
                <ListItem key={text} style={{ width: "fit-content" }}>
                  <Link
                    to={
                      text.toLowerCase() === "home"
                        ? "/announcements"
                        : "/" + text.toLowerCase()
                    }
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    <ListItemButton>
                      <ListItemText
                        style={{ color: "#1ba098" }}
                        primaryTypographyProps={{ fontSize: "2rem" }}
                        primary={text}
                      />
                    </ListItemButton>
                  </Link>
                </ListItem>
              ))}
              <ListItem key={"logout"} sx={{ width: "fit-content" }}>
                <ListItemButton
                  sx={{
                    width: "100%",
                    textAlign: "center",
                  }}
                  onClick={logOut}
                >
                  <ListItemText
                    style={{ color: "#1ba098" }}
                    primaryTypographyProps={{ fontSize: "2rem" }}
                    primary="Logout"
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </Toolbar>
        </AppBar>
      </Box>
    );
};

export default NavBar;
