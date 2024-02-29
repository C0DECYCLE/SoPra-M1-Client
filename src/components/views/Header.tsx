import React from "react";
import PropTypes from "prop-types";
import "../../styles/views/Header.scss";

const Header = (props) => (
  <div className="header container" style={{ height: props.height }}>
    <h1 className="header title">SoPra FS24 M1</h1>
    <label className="header subtitle">Noah Mattia Bussinger</label>
  </div>
);

Header.propTypes = {
  height: PropTypes.string,
};

export default Header;
