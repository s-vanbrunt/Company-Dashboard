import React from "react";

const UserCard = ({name, email, active, admin, status}) => {
    const isActive = active ? (
        <span className="active">YES</span>
    ) : (
        <span className="inactive">NO</span>
    );
    const isAdmin = admin ? (
        <span className="active">YES</span>
    ) : (
        <span className="inactive">NO</span>
    );

    return (
        <div className="user-details row-with-5-columns user-card">
            <span className="user-name">{name}</span>
            <span className="user-email">{email}</span>
            {isActive}
            {isAdmin}
            <span style={{textTransform: "uppercase"}} className="user-status">{status}</span>
        </div>
    )
};

export default UserCard;