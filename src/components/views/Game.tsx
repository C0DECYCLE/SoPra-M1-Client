import React, { useEffect, useState } from "react";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";
import { User } from "models/User";
import UserManager from "managers/UserManager";

const Player = ({ user }: { user: User }) => {
  const dynColor = user.status === "ONLINE" ? "green" : "red";
  return (
    <div className="player container">
      <div className="player username">{user.username}</div>
      <div className="player status" style={{ color: dynColor }}>
        {user.status}
      </div>
    </div>
  );
};

Player.propTypes = {
  user: PropTypes.object,
};

const Game = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>(null);

  const logout = (): void => {
    UserManager.logout();
    navigate("/login");
  };

  useEffect(() => {
    async function fetchData() {
      const users = await UserManager.fetchUsers();
      if (users) {
        setUsers(users);
      }
    }
    fetchData();
  }, []);

  let content = <Spinner />;

  if (users) {
    content = (
      <div className="game">
        <ul className="game user-list">
          {users.map((user: User) => (
            <li key={user.id}>
              <Player user={user} />
            </li>
          ))}
        </ul>
        <Button width="100%" onClick={() => logout()}>
          Logout
        </Button>
      </div>
    );
  }

  return (
    <BaseContainer className="game container">
      <p className="game paragraph">Registered users</p>
      {content}
    </BaseContainer>
  );
};

export default Game;
