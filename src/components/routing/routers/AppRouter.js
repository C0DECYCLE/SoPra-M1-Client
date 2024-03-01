import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { UsersGuard } from "../routeProtectors/UsersGuard";
import UsersRouter from "./UsersRouter";
import { LoginGuard } from "../routeProtectors/LoginGuard";
import Login from "../../views/Login";
import { RegistrationGuard } from "../routeProtectors/RegistrationGuard";
import Registration from "../../views/Registration";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/users/*" element={<UsersGuard />}>
          <Route path="/users/*" element={<UsersRouter base="/users" />} />
        </Route>

        <Route path="/login" element={<LoginGuard />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route path="/registration" element={<RegistrationGuard />}>
          <Route path="/registration" element={<Registration />} />
        </Route>

        <Route path="/" element={<Navigate to="/users" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

/*
 * Don't forget to export your component!
 */
export default AppRouter;
