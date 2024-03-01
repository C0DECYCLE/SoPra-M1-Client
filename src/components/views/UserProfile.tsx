import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/UserProfile.scss";
import BaseContainer from "components/ui/BaseContainer";
import UserManager from "managers/UserManager";
import { log, warn } from "helpers/logger";
import { Spinner } from "components/ui/Spinner";
import User from "models/User";

const UserProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User>(null);
  const id = parseInt(location.pathname.split("/").at(-1));

  const doCancel = () => {
    navigate("/users");
  };

  useEffect(() => {
    if (isNaN(id)) {
      doCancel();
    }
  }, []);

  UserManager.onListChange.once(() => {
    if (!UserManager.hasId(id)) {
      doCancel();
    }
    setUser(UserManager.getById(id));
  });

  let content = <Spinner />;

  if (user) {
    const mode = user.status === "ONLINE" ? "on" : "off";
    content = (
      <div className="userprofile form">
        <h3>{user.username}</h3>
        <div className="userprofile leftright">
          <div className="userprofile left">
            <label>Status</label>
            <label>Creation Date</label>
            <label>Birthday</label>
          </div>
          <div className="userprofile right">
            <label className={`userprofile ${mode}`}>{user.status}</label>
            <label>{new Date(user.creation_date).toLocaleDateString()}</label>
            <label>
              {user.birthday
                ? new Date(user.birthday).toLocaleDateString()
                : "-"}
            </label>
          </div>
        </div>
        <div className="userprofile button-container">
          <Button width="100%" onClick={() => doCancel()}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <BaseContainer>
      <div className="userprofile container">{content}</div>
    </BaseContainer>
  );
};

export default UserProfile;
