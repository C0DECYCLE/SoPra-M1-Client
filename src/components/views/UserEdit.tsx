import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/UserEdit.scss";
import BaseContainer from "components/ui/BaseContainer";
import UserManager from "managers/UserManager";
import { log, warn } from "helpers/logger";
import { Spinner } from "components/ui/Spinner";
import User from "models/User";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const UserEdit = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>(null);
  const [username, setUsername] = useState<string>(undefined);
  const [birthday, setBirthday] = useState<Date>(undefined);

  const getUsername = () => {
    let useUsername = username;
    if (user && useUsername === user.username) {
      useUsername = undefined;
    }
    return useUsername;
  };

  const getBirthday = () => {
    let useBirthday = birthday;
    if (
      user &&
      new Date(useBirthday).toLocaleDateString() ===
        new Date(user.birthday).toLocaleDateString()
    ) {
      useBirthday = undefined;
    }
    return useBirthday;
  };

  const shouldUnbirthday = () => user && user.birthday && !birthday;

  const doSave = async () => {
    const useUsername = getUsername();
    const useBirthday = getBirthday();
    await UserManager.update(useUsername, useBirthday);
    if (shouldUnbirthday()) {
      await UserManager.unbirthday();
    }
    setUser(JSON.parse(JSON.stringify(UserManager.me)));
  };

  const doCancel = () => {
    navigate("/users");
  };

  UserManager.onTick.once(() => {
    setUser(JSON.parse(JSON.stringify(UserManager.me)));
  });

  if (user) {
    if (username === undefined) {
      setUsername(user.username);
    }

    if (birthday === undefined) {
      setBirthday(user.birthday === null ? null : new Date(user.birthday));
    }
  }

  let content = <Spinner />;

  if (user) {
    const mode = user.status === "ONLINE" ? "on" : "off";
    content = (
      <div className="useredit form">
        <div className="useredit namefield">
          <input
            className="useredit name"
            placeholder={user.username}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="useredit leftright">
          <div className="useredit left">
            <label>Status</label>
            <label>Creation Date</label>
            <label>Birthday</label>
          </div>
          <div className="useredit right">
            <label className={`useredit ${mode}`}>{user.status}</label>
            <label>{new Date(user.creation_date).toLocaleDateString()}</label>
            <DatePicker
              className="useredit date"
              wrapperClassName="useredit picker"
              calendarClassName="useredit picker"
              dateFormat="dd/MM/yyyy"
              selected={birthday}
              onChange={(date) => setBirthday(date)}
            />
          </div>
        </div>
        <div className="useredit button-container">
          <Button
            disabled={!getUsername() && !getBirthday() && !shouldUnbirthday()}
            width="100%"
            onClick={() => doSave()}
          >
            Save
          </Button>
        </div>
        <div className="useredit button-container">
          <Button width="100%" onClick={() => doCancel()}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <BaseContainer>
      <div className="useredit container">{content}</div>
    </BaseContainer>
  );
};

export default UserEdit;
