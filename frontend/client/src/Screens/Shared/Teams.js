import { Navigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import TeamCard from "../../Components/TeamCard";
import NavBar from "../../Components/NavBar";
import { appState, teamState, userState } from "../../globalstate";
import { getTeams } from "../../Services/teams";
import { useEffect } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const Teams = ({ openModal }) => {
  const [app] = useRecoilState(appState);
  const [user] = useRecoilState(userState);
  const [teams, setTeams] = useRecoilState(teamState);

  useEffect(() => {
    if (!app.viewCompanyId) return;
    const getAllTeams = async () => {
      const data = await getTeams(app.viewCompanyId);
      //console.log(data);
      setTeams(data);
    };
    if (user.isAdmin) {
      getAllTeams();
    }
  }, [app.viewCompanyId, user.isAdmin, setTeams]);

  const ts = teams.map(({ id, name, description, teammates }) => (
    <TeamCard
      key={id}
      id={id}
      name={name}
      projectCount={4}
      description={description}
      teammates={teammates}
    />
  ));

  const handleClick = e => {
    openModal("create-team");
  };

  if (!user.isLoggedIn) {
    return <Navigate replace to="/" />;
  } else if (!app.viewCompanyId) {
    return <Navigate replace to="/company" />;
  } else {
    return (
      <div className="page">
        <NavBar />
        <div className="page-body">
          <h1>Teams</h1>
          <div className="team-body">
            {ts}
            {user.isAdmin && (
              <div className="add-team-btn" onClick={handleClick} role="button">
                <AddCircleOutlineIcon className="add-team-icon" />
                <span>New Team</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default Teams;
