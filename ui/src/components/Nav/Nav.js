import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import Login from "../Login";
import LogoutPopup from "../LogoutPopup";
import { useAuth } from "../../services/AuthProvider";
import "./Nav.css";
const Nav = () => {
  const { userInfo } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navLinkClass = ({ isActive }) => `nav-link ${isActive ? "active" : ""}`;
  const loggedInTabs = (
    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
      <li className="nav-item">
        <NavLink to="/" className={navLinkClass}>
          Home
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/explorer" className={navLinkClass}>
          Explore
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/status" className={navLinkClass}>
          Profile
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/analytics" className={navLinkClass}>
          Analytics
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/chat" className={navLinkClass}>
          Chat
        </NavLink>
      </li>
      <li className="nav-item">
        <button
          className="btn btn-outline-danger"
          onClick={() => setShowLogoutModal(true)}
        >
          Logout
        </button>
        <LogoutPopup
          show={showLogoutModal}
          handleClose={() => setShowLogoutModal(false)}
        />
      </li>
    </ul>
  );
  const loggedOutTabs = (
    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
      <li className="nav-item">
        <NavLink to="/" className={navLinkClass}>
          Home
        </NavLink>
      </li>
      <li className="nav-item">
        <button
          className="btn btn-outline-primary"
          onClick={() => {
            setShowLogin(true);
          }}
        >
          Login
        </button>
        <Login showLogin={showLogin} setShowLogin={setShowLogin} />
      </li>
    </ul>
  );
  return (
    <>
      <nav className="navbar navbar-expand-md  bg-nav sticky-top  shadow-sm p-3">
        <div className="container-fluid">
          <h1 className="navbar-brand">CS5224</h1>
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
            {userInfo?.authenticated ? loggedInTabs : loggedOutTabs}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Nav;
