import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import UserManager from "managers/UserManager";
import { Spinner } from "components/ui/Spinner";

export function BaseGuard(loggedIn, loggedOut) {
  const [isLoggedIn, setLoggedIn] = useState(undefined);

  useEffect(() => {
    async function tryLogin() {
      await UserManager.login();
      setLoggedIn(UserManager.isLoggedIn);
    }
    tryLogin();
  }, []);

  if (isLoggedIn === undefined) {
    return (
      <div className="loading-spinner-div">
        <Spinner />
      </div>
    );
  }
  return isLoggedIn ? loggedIn : loggedOut;
}
