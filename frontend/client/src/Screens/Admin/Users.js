import { Navigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import NavBar from "../../Components/NavBar";
import { allUsersState, appState, userState } from "../../globalstate";
import "../../App.css";
import UserCard from "../../Components/UserCard";
import { getCompanyUsers } from "../../Services/users";
import { useEffect } from "react";

const Users = ({ openModal }) => {
  const [app] = useRecoilState(appState);
  const [user] = useRecoilState(userState);
  const [users, setUsers] = useRecoilState(allUsersState);

  useEffect(() => {
    if (!app.viewCompanyId) return;
    const getAllUsers = async () => {
      const response = await getCompanyUsers(app.viewCompanyId);
      setUsers(response.data);
      //console.log('users response');
      //console.log(response.data);
    };
    if (user.isAdmin) {
      getAllUsers();
    }
  }, [app.viewCompanyId, user.isAdmin, setUsers]);

  function openAddModal() {
    openModal("add-user");
  }

  const showUsers = users.map(({ id, profile = {}, admin, active, status }) => (
    <UserCard
      key={id}
      name={profile.firstName + " " + profile.lastName}
      email={profile.email}
      active={active}
      admin={admin}
      status={status}
    />
  ));

  if (!user.isLoggedIn) {
    return <Navigate replace to="/" />;
  } else if (app.viewCompanyId === undefined) {
    return <Navigate replace to="/company" />;
  } else {
    return (
      <div className="page">
        <NavBar />
        <div className="page-body users">
          <div className="header-w-subtitle-wrapper">
            <h1>User Registry</h1>
            <h2>A general view of all your members in your organization</h2>
          </div>
          <div className="user-list">
            <div className="user-table">
              <div className="row-with-5-columns user-header-card">
                <span>Name</span>
                <span>Email</span>
                <span>Active</span>
                <span>Admin</span>
                <span>Status</span>
              </div>
              {showUsers}
            </div>
            {user.isAdmin && (
              <button className="add-user-btn" onClick={openAddModal}>
                Add User
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default Users;
