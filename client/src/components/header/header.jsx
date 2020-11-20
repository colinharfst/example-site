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
            <span
              className="link"
              tabIndex={0}
              onKeyDownCapture={(event) => {
                if (event.keyCode === 13) {
                  document.getElementsByClassName("sublinks")[0].classList.add("clicked-open");
                }
              }}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  document.getElementsByClassName("sublinks")[0].classList.remove("clicked-open");
                }
              }}
            >
              Math
              <div className="sublinks">
                <Link className="link" to="/math">
                  Research
                </Link>
                <Link className="link" to="/simulation">
                  Monte Carlo
                </Link>
              </div>
            </span>
          </li>
          <li>
            <Link className="link" to="/baseball">
              Baseball
            </Link>
          </li>
          <li>
            <span
              className="link"
              tabIndex={0}
              onKeyDownCapture={(event) => {
                if (event.keyCode === 13) {
                  document.getElementsByClassName("sublinks")[1].classList.add("clicked-open");
                }
              }}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  document.getElementsByClassName("sublinks")[1].classList.remove("clicked-open");
                }
              }}
            >
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
          <li>
            <Link className="link" to="/news">
              News
            </Link>
          </li>
        </ul>
      </nav>
      <Link className="secret-link" to="/playground" tabIndex={-1}>
        <img src={logo} className="app-logo" alt="logo" />
      </Link>
    </header>
  );
}

export default Header;
