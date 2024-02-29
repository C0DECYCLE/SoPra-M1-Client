import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";
import { User } from "models/User";
import { toast } from "react-toastify";

const Player = ({ user }: { user: User }) => {
  return (
    <div className="player container">
      <div className="player username">{user.username}</div>
      <div className="player id">id: {user.id}</div>
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
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get("/users");

        //console.log(response);
        //await new Promise((resolve) => setTimeout(resolve, 1000));

        setUsers(response.data);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the users: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);

        toast.error(
          "Something went wrong while fetching the users! See the console for details."
        );
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
      <p className="game paragraph">Get all users from secure endpoint:</p>
      {content}
    </BaseContainer>
  );
};

export default Game;
