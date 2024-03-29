import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { UsersGuard } from "../routeProtectors/UsersGuard";
import { LoginGuard } from "../routeProtectors/LoginGuard";
import Login from "../../views/Login";
import { RegistrationGuard } from "../routeProtectors/RegistrationGuard";
import Registration from "../../views/Registration";
import Users from "../../views/Users";
import UserProfile from "../../views/UserProfile";
import UserEdit from "../../views/UserEdit";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<LoginGuard />}>
          <Route path="" element={<Login />} />
        </Route>

        <Route path="/registration" element={<RegistrationGuard />}>
          <Route path="" element={<Registration />} />
        </Route>

        <Route path="/users" element={<UsersGuard />}>
          <Route path="" element={<Users />} />
          <Route path="profile/*" element={<UserProfile />} />
          <Route path="edit" element={<UserEdit />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
