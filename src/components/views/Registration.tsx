import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Registration.scss";
import BaseContainer from "components/ui/BaseContainer";
import FormField from "components/ui/LogRegForm";
import UserManager from "managers/UserManager";

const Registration = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const doRegistration = async () => {
    const successful = await UserManager.registrate({ username, password });
    if (successful) {
      navigate("/users");
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
              isPassword={false}
            />
            <FormField
              label="Password"
              value={password}
              onChange={(n) => setPassword(n)}
              isPassword={true}
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
