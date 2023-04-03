import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { Route, Routes } from "react-router-dom";
import { useRecoilState } from "recoil";
import {
  appState,
  modalState,
  userState,
  companyState,
  teamState,
} from "./globalstate";
import "./App.css";
import Announcements from "./Screens/Shared/Announcements";
import Login from "./Screens/Shared/Login";
import CompanyScreen from "./Screens/Admin/Company";
import Projects from "./Screens/Admin/Projects";
import Users from "./Screens/Admin/Users";
import Teams from "./Screens/Shared/Teams";
import ModalContainer from "./Components/ModalContainer";

function App() {
  const [app, setAppState] = useRecoilState(appState);
  const [modal, setModal] = useRecoilState(modalState);
  const [user] = useRecoilState(userState);
  const [companies, setCompanies] = useRecoilState(companyState);
  const [teams, setTeams] = useRecoilState(teamState);

  function openModal(type, data = {}) {
    setModal({ isOpen: true, type, data });
    console.table(`Modal: ${type}`, data);
  }

  function closeModal(e) {
    e.stopPropagation();
    setModal({ isOpen: false, type: "", data: {} });
  }

  // initialize
  useEffect(() => {
    if (user) {
      console.log("User:", user);
      setCompanies(user.companies);
      setTeams(user.teams);
      // skip company screen
      if (!user.isAdmin && user.companies) {
        setAppState(
          Object.assign({}, app, { viewCompanyId: user.companies[0].id })
        );
      }
    }
  }, [user]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/announcements"
          element={<Announcements openModal={openModal} />}
        />
        <Route path="/company" element={<CompanyScreen />} />
        <Route path="/projects" element={<Projects openModal={openModal} />} />
        <Route path="/users" element={<Users openModal={openModal} />} />
        <Route path="/teams" element={<Teams openModal={openModal} />} />
        {/* <Route path="/project" element={<Project openModal={openModal} />} /> */}
      </Routes>
      {modal.isOpen &&
        createPortal(
          <ModalContainer
            isOpen={modal.isOpen}
            type={modal.type}
            closeModal={(e) => closeModal(e)}
          />,
          document.body
        )}
    </div>
  );
}

export default App;
