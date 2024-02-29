import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import FormField from "components/ui/LogRegForm";
import "react-toastify/dist/ReactToastify.css";
import UserManager from "managers/UserManager";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>(null);
  const [password, setPassword] = useState<string>(null);

  const doLogin = async () => {
    const successful = await UserManager.login({ username, password });
    if (successful) {
      navigate("/game");
    }
  };

  const goRegistration = () => {
    navigate("/registration");
  };

  return (
    <BaseContainer>
      <div className="login container">
        <div className="login form">
          <div className="login fields">
            <FormField
              label="Username"
              value={username}
              onChange={(un: string) => setUsername(un)}
              isPassword={false}
            />
            <FormField
              label="Password"
              value={password}
              onChange={(n: string) => setPassword(n)}
              isPassword={true}
            />
            <div className="login button-container">
              <Button
                disabled={!username || !password}
                width="100%"
                onClick={() => doLogin()}
              >
                Login
              </Button>
            </div>
          </div>
          <label className="logregform label">No account?</label>
          <div className="login button-container">
            <Button width="100%" onClick={() => goRegistration()}>
              Registrate
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default Login;
