import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogoutOutlined } from "@ant-design/icons";
import { message } from "antd";
import logo from "./expenseLogo.png";
import "./Header.css"; // Import CSS file

const Header = () => {
  const [loginUser, setLoginUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setLoginUser(user);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
    message.success("Logged out successfully");
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-section">
          <img src={logo} alt="Expense Tracker Logo" className="logo" />
          <h1 className="app-title">Expense Tracker</h1>
        </div>
        <nav>
          <ul className="nav-links">
            {loginUser && (
              <li className="username">
                Welcome, {loginUser.name.split(" ")[0]}
              </li>
            )}
            {loginUser && (
              <li>
                <button className="logout-button" onClick={handleLogout}>
                  <LogoutOutlined className="logout-icon" />
                  Logout
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
