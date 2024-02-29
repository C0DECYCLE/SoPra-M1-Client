import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { GameGuard } from "../routeProtectors/GameGuard";
import GameRouter from "./GameRouter";
import { LoginGuard } from "../routeProtectors/LoginGuard";
import Login from "../../views/Login";
import { RegistrationGuard } from "../routeProtectors/RegistrationGuard";
import Registration from "../../views/Registration";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/game/*" element={<GameGuard />}>
          <Route path="/game/*" element={<GameRouter base="/game" />} />
        </Route>

        <Route path="/login" element={<LoginGuard />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route path="/registration" element={<RegistrationGuard />}>
          <Route path="/registration" element={<Registration />} />
        </Route>

        <Route path="/" element={<Navigate to="/game" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

/*
 * Don't forget to export your component!
 */
export default AppRouter;
