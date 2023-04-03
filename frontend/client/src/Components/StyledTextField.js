import { styled, TextField } from "@mui/material";

const StyledTextField = styled(TextField)({
  "& input": { color: "#fff", fontSize: "1.4rem" },
  "& textarea": { color: "#fff", fontSize: "1.4rem", paddingBottom: "5px" },
  "& label": { color: "#1ba098", fontSize: "1.6rem" },
  "& label.Mui-focused": { color: "#deb992" },
  "& .MuiInput-underline:before": { borderBottomColor: "#1ba098" },
  "& .MuiInput-underline:after": { borderBottomColor: "#deb992" }
});

export default StyledTextField;
