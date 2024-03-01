import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import { BaseGuard } from "./BaseGuard";

export const UsersGuard = () =>
  BaseGuard(<Outlet />, <Navigate to="/login" replace />);

UsersGuard.propTypes = {
  children: PropTypes.node,
};
