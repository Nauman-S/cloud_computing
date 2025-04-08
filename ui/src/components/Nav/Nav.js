import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import Login from "../Login";
import LogoutPopup from "../LogoutPopup";
import { useAuth } from "../../services/AuthProvider";

const Nav = () => {
  const { userInfo } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const loggedInTabs = (
    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
      <li className="nav-item">
        <Link to="/" className="nav-link">
          Home
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/about" className="nav-link">
          About
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/services" className="nav-link">
          Services
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/status" className="nav-link">
          Status
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/analytics" className="nav-link">
          Analytics
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/chat" className="nav-link">
          Chat
        </Link>
      </li>
      <li className="nav-item">
        <button
          className="btn btn-outline-danger"
          onClick={() => setShowLogoutModal(true)}
        >
          Logout
        </button>
        <LogoutPopup show={showLogoutModal} handleClose={() => setShowLogoutModal(false)} />
      </li>
    </ul>
  );
  const loggedOutTabs = (
    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
      <li className="nav-item">
        <Link to="/" className="nav-link">
          Home
        </Link>
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
      <nav className="navbar navbar-expand-md navbar-light bg-light shadow-sm p-3">
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
            {userInfo?.authenticated? loggedInTabs: loggedOutTabs}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Nav;
