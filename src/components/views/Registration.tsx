import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Registration.scss";
import BaseContainer from "components/ui/BaseContainer";
import FormField from "components/ui/LogRegForm";
import { toast } from "react-toastify";

const Registration = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>(null);
  const [password, setPassword] = useState<string>(null);

  const doRegistration = async () => {
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post("/users", requestBody);

      const user = new User(response.data);
      localStorage.setItem("token", user.token);

      navigate("/game");
    } catch (e) {
      const data = e.response.data;
      if (data.status === 409) {
        toast.error(data.message);
      } else {
        toast.error(
          `Something went wrong during the login: \n${handleError(e)}`
        );
      }
    }
  };

  const doCancel = () => {
    navigate("/login");
  };

  return (
    <BaseContainer>
      <div className="registration container">
        <div className="registration form">
          <div className="registration fields">
            <FormField
              label="Username"
              value={username}
              onChange={(un: string) => setUsername(un)}
            />
            <FormField
              label="Password"
              value={password}
              onChange={(n) => setPassword(n)}
            />
          </div>
          <div className="registration button-container">
            <Button
              disabled={!username || !password}
              width="100%"
              onClick={() => doRegistration()}
            >
              Registrate
            </Button>
          </div>
          <div className="registration button-container">
            <Button width="100%" onClick={() => doCancel()}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default Registration;
