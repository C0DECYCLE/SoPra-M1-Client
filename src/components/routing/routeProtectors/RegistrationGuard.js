import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import { BaseGuard } from "./BaseGuard";

export const RegistrationGuard = () =>
  BaseGuard(<Navigate to="/users" replace />, <Outlet />);

RegistrationGuard.propTypes = {
  children: PropTypes.node,
};
