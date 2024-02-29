import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import FormField from "components/ui/LogRegForm";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>(null);
  const [password, setPassword] = useState<string>(null);

  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post("/user", requestBody);

      const user = new User(response.data);
      localStorage.setItem("token", user.token);

      navigate("/game");
    } catch (e) {
      const data = e.response.data;
      if (data.status === 406) {
        toast.error(data.message);
      } else {
        toast.error(
          `Something went wrong during the login: \n${handleError(e)}`
        );
      }
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
