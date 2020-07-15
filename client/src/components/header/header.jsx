import React from "react";
import "./header.scss";
import { Link } from "react-router-dom";
import logo from "./react-logo.svg";

export function Header() {
  return (
    <header className="app-header">
      <nav style={{ width: "100%" }}>
        <ul className="app-header-list">
          <li className="welcome-link">
            <Link className="link" to="/">
              --Welcome--
            </Link>
          </li>
          <li>
            <Link className="link" to="/resume">
              Resume
            </Link>
          </li>
          <li>
            <Link className="link" to="/math">
              Math
            </Link>
          </li>
          <li>
            <Link className="link" to="/baseball">
              Baseball
            </Link>
          </li>
          <li>
            <span className="link">
              Chess
              <div className="sublinks">
                <Link className="link" to="/chess">
                  Games
                </Link>
                <Link className="link" to="/chess-data">
                  Data
                </Link>
              </div>
            </span>
          </li>
          {/* <li>
            <Link className="link" to="/math">
              Writing
            </Link>
          </li>
          <li>
            <Link className="link" to="/math">
              Maps
            </Link>
          </li> */}
        </ul>
      </nav>
      <img src={logo} className="app-logo" alt="logo" />
    </header>
  );
}

export default Header;
