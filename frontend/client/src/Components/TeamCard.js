import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useRecoilState } from "recoil";
import { appState, projectsState } from "../globalstate";
import { getProjects } from "../Services/projects";

const TeamCard = ({ id, name, description, teammates }) => {
  const [app, setApp] = useRecoilState(appState);
  const [projects, setProjects] = useRecoilState(projectsState);
  const [projs, setProjs] = useState([{}]);

  /**
   * Update local projects on rendering
   */
  useEffect(() => {
    const getProjs = async () => {
      const data = await getProjects(app.viewCompanyId, id);
      setProjs(data);
    };

    getProjs();
  }, [app.viewCompanyId, id, projs]);

  /**
   * Update global projects
   */
  const updateProjects = () => {
    setProjects(projs);
  };

  const setTeamId = () =>
    setApp(
      Object.assign({}, app, {
        viewTeamId: id,
      })
    );

  return (
    <div className="team-card">
      <div className="team-header">
        <NavLink
          to={{ pathname: "/projects" }}
          onClick={() => {
            setTeamId();
            updateProjects();
          }}
          state={{ name }}
        >
          {name}
        </NavLink>
        <span># of projects: {projs.length}</span>
      </div>
      <div className="team-members">
        {teammates.map((member) => (
          <div key={member.id} className="team-pill">
            {member.profile.firstName} {member.profile.lastName}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamCard;
