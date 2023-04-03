import { Navigate, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState, companyState, appState } from "../../globalstate";
import NavBar from "../../Components/NavBar";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
const CompanyScreen = () => {
  const [app, setAppState] = useRecoilState(appState);
  const [user] = useRecoilState(userState);
  const [companies] = useRecoilState(companyState);
  const navigate = useNavigate();

  const options = companies.map((company) => (
    <MenuItem
      sx={{ fontSize: "16px" }}
      key={company.id}
      value={company.id.toString()}
    >
      {company.name}
    </MenuItem>
  ));

  function handleChange(e) {
    setAppState(Object.assign({}, app, { viewCompanyId: e.target.value }));
    navigate("/announcements");
  }

  const style = {
    backgroundColor: "white",
    borderRadius: "6px",
    fontSize: "16px",
    minWidth: "140px",
  };
  const labelStyle = {
    fontSize: "14px",
    "&.Mui-focused": { display: "none" },
  };

  if (!user.isLoggedIn) {
    return <Navigate replace to="/" />;
  } else if (!user.isAdmin && app.viewCompanyId) {
    return <Navigate replace to="/announcements" />;
  } else {
    return (
      <div className="page">
        <NavBar />
        <div className="page-body">
          <h1>Select Company</h1>

          {companies.length > 0 && (
            <FormControl sx={style}>
              <InputLabel
                sx={labelStyle}
                id="demo-simple-select-standard-label"
              >
                Pick a Company
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                onChange={(event) => handleChange(event)}
              >
                {options}
              </Select>
            </FormControl>
          )}
        </div>
      </div>
    );
  }
};

export default CompanyScreen;
