import React, { useState, useEffect } from "react";
import "./dark-mode.scss";
import Switch from "@material-ui/core/Switch";

export function DarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (window.localStorage.getItem("dark-mode") === "light") {
      const elem = document.getElementsByClassName("app")[0];
      elem.className = "app";
      setIsDarkMode(false);
    }
  }, []);

  const handleSwitch = () => {
    const elem = document.getElementsByClassName("app")[0];
    if (isDarkMode) {
      elem.className = "app";
      window.localStorage.setItem("dark-mode", "light");
    } else {
      elem.className = "app dark-mode";
      window.localStorage.setItem("dark-mode", "dark");
    }
    setIsDarkMode(!isDarkMode);
  };

  return (
    <span className="dark-mode-switch">
      <Switch checked={isDarkMode} onChange={handleSwitch} />
    </span>
  );
}

export default DarkMode;
