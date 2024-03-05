import React, { useState } from "react";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Users.scss";
import { User } from "models/User";
import UserManager from "managers/UserManager";

const UserElement = ({ user }: { user: User }) => {
  const navigate = useNavigate();
  const mode = user.status === "ONLINE" ? "on" : "off";
  const goProfile = () => {
    navigate(`/users/profile/${user.id}`);
  };
  return (
    <button className="user container" onClick={() => goProfile()}>
      <div className="user username">{user.username}</div>
      <div className={`user status ${mode}`}>{user.status}</div>
    </button>
  );
};

UserElement.propTypes = {
  user: PropTypes.object,
};

const Users = () => {
  const [users, setUsers] = useState<User[]>(null);
  const navigate = useNavigate();

  const logout = (): void => {
    UserManager.logout();
    navigate("/login");
  };

  UserManager.onListChange.once(() => setUsers(UserManager.list));

  let content = <Spinner />;

  if (users) {
    content = (
      <div className="users">
        <ul className="users user-list">
          {users.map((user: User) =>
            user.id !== UserManager.me?.id ? (
              <li key={user.id}>
                <UserElement user={user} />
              </li>
            ) : undefined
          )}
        </ul>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <BaseContainer className="users container">
        <h3>{`Welcome ${UserManager.me?.username}`}</h3>
        <Button width="100%" onClick={() => {}}>
          Edit
        </Button>
        <div className="users buttonspacing"></div>
        <Button width="100%" onClick={() => logout()}>
          Logout
        </Button>
        <p className="users paragraph">Other users:</p>
        {content}
      </BaseContainer>
    </div>
  );
};

export default Users;
