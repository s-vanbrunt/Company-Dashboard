import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "../../globalstate";
import { projectsState } from "../../globalstate";
import { appState } from "../../globalstate";
import { Link } from "react-router-dom";
import NavBar from "../../Components/NavBar";
import ProjectCard from "../../Components/ProjectCard";
import { getProjects } from "../../Services/projects";
import { useLocation } from "react-router-dom";

const Projects = ({ openModal }) => {
  const [app] = useRecoilState(appState);
  const [user] = useRecoilState(userState);
  const [projects, setProjects] = useRecoilState(projectsState);
  const location = useLocation();
  const team =
    location.state?.name || (projects[0] && projects[0].team?.name) || "Team";

  function openAddModal() {
    openModal("create-project");
  }

  function openEditModal(project) {
    const data = {
      id: project.id,
      title: project.title,
      message: project.message,
      active: project.active,
      teamObj: project.teamObj,
    };
    openModal("edit-project", data);
  }

  function openDeleteModal(project) {
    const data = {
      id: project.id,
      credentials: {
        username: user.username,
        password: user.password,
      },
    };
    openModal("delete-project", data);
  }

  const projs = projects.map((p) => (
    <ProjectCard
      key={p.id}
      name={p.name}
      description={p.description}
      active={p.active}
      openEditModal={() =>
        openEditModal({
          id: p.id,
          title: p.name,
          message: p.description,
          active: p.active,
        })
      }
      openDeleteModal={() => openDeleteModal({ id: p.id })}
      isAdmin={user.isAdmin}
    />
  ));

  //if refreshing on projects page, refetch
  useEffect(() => {
    if (projects.length === 0) {
      if (app.viewCompanyId && app.viewTeamId) {
        getProjects(app.viewCompanyId, app.viewTeamId).then((data) =>
          setProjects(data)
        );
      }
    }
  }, []);

  if (!user.isLoggedIn) {
    return <Navigate replace to="/" />;
  } else {
    return (
      <div className="page">
        <NavBar />
        <div className="page-body">
          <div className="header-wrapper">
            <Link to="/teams" className="go-back">
              {"<"} Back
            </Link>
            <h1>Projects for {team}</h1>
          </div>

          <div className="project-list">
            {user.isAdmin && (
              <button className="new-project-btn" onClick={openAddModal}>
                New
              </button>
            )}
            {projs}
          </div>
        </div>
      </div>
    );
  }
};

export default Projects;
