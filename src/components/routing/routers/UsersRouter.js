import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Users from "../../views/Users";
import PropTypes from "prop-types";

const UsersRouter = () => {
  //what dashboard?
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Routes>
        <Route path="" element={<Users />} />
        <Route path="dashboard" element={<Users />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </div>
  );
};

UsersRouter.propTypes = {
  base: PropTypes.string,
};

export default UsersRouter;
