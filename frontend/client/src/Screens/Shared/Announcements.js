import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import NavBar from "../../Components/NavBar";
import { announcementsState, appState, userState } from "../../globalstate";
import { getAnnouncements } from "../../Services/announcements";

const Announcements = ({ openModal }) => {
  const [app] = useRecoilState(appState);
  const [user] = useRecoilState(userState);
  const [announcements, setAnnouncements] = useRecoilState(announcementsState);
  const [sortedAnnouncements, setSortedAnnouncements] = useState([]);

  useEffect(() => {
    if (!app.viewCompanyId) return;
    getAnnouncements(app.viewCompanyId).then((res) => {
      //console.log(res);
      setAnnouncements(res);
    });
  }, []);

  useEffect(() => {
    setSortedAnnouncements(sortByDate(announcements));
    //console.log("Before sorting:", announcements);
    //console.log("After sorting:", sortedAnnouncements);
  }, [announcements]);

  const sortByDate = (arr) => {
    const array = [...arr];

    function compare(a, b) {
      if (a.date < b.date) {
        return -1;
      }
      if (a.date > b.date) {
        return 1;
      }
      return 0;
    }

    return array.sort(compare);
  };

  const formatDate = (date) =>
    date.toLocaleDateString("en-us", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const getAuthorName = ({ firstName, lastName }) => {
    return firstName + " " + lastName[0] + ".";
  };

  const handleClickNew = (e) => {
    e.preventDefault();
    const data = {
      credentials: { username: user.username, password: user.password },
      companyId: app.viewCompanyId,
    };
    openModal("create-announcement", data);
  };

  const handleClickEdit = (announcement) => {
    const data = {
      id: announcement.id,
      credentials: { username: user.username, password: user.password },
      title: announcement.title,
      message: announcement.message,
    };
    openModal("edit-announcement", data);
  };

  const handleClickDelete = (announcement) => {
    const data = {
      id: announcement.id,
      credentials: { username: user.username, password: user.password },
    };
    openModal("delete-announcement", data);
  };

  if (!user.isLoggedIn) {
    return <Navigate replace to="/" />;
  } else if (!app.viewCompanyId) {
    return <Navigate replace to="/company" />;
  } else {
    return (
      <div className="page">
        <NavBar />
        <div className="announce-wrapper">
          <div className={`announce-top${!user.isAdmin ? " not-admin" : ""}`}>
            <h1>Announcements</h1>
            {user.isAdmin && (
              <button onClick={handleClickNew} className="announce-btn">
                New
              </button>
            )}
          </div>
          <div className="announce-list">
            {sortedAnnouncements.map((announcement) => (
              <article
                key={announcement.id}
                className={`announce-card${
                  user.id === announcement.author.id ? " isAuthor" : ""
                }`}
              >
                {user.id === announcement.author.id ? (
                  <div className="announce-options">
                    <EditIcon
                      className="announce-icon edit"
                      role="button"
                      onClick={() => handleClickEdit(announcement)}
                    />
                    <DeleteForeverIcon
                      className="announce-icon delete"
                      role="button"
                      onClick={() => handleClickDelete(announcement)}
                    />
                  </div>
                ) : null}
                <div className="content">
                  <header>
                    <h2>{announcement.title}</h2>
                    <div className="announce-info">
                      <div>{getAuthorName(announcement.author.profile)}</div>
                      <div>{formatDate(announcement.date)}</div>
                    </div>
                  </header>
                  <p>{announcement.message}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    );
  }
};

export default Announcements;
