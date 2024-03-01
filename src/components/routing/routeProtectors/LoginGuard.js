import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import { BaseGuard } from "./BaseGuard";

export const LoginGuard = () =>
  BaseGuard(<Navigate to="/users" replace />, <Outlet />);

LoginGuard.propTypes = {
  children: PropTypes.node,
};
