import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";

export const RegistrationGuard = () => {
  return <Outlet />;
};

RegistrationGuard.propTypes = {
  children: PropTypes.node,
};
