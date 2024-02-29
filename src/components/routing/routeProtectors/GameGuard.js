import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import { BaseGuard } from "./BaseGuard";

export const GameGuard = () =>
  BaseGuard(<Outlet />, <Navigate to="/login" replace />);

GameGuard.propTypes = {
  children: PropTypes.node,
};
