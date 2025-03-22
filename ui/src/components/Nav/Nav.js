import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import Login from "../Login";
import FullDashboard from "../Dashboard/FullDashboard";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  const handleLinkClick = () => {
    setShowDashboard(false);
  };

  return (
    <>
      <nav className="navbar navbar-expand-md navbar-light bg-light shadow-sm p-3">
        <div className="container-fluid">
          <h1 className="navbar-brand">Logo</h1>
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link to="/" className="nav-link" onClick={handleLinkClick}>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/about"
                  className="nav-link"
                  onClick={handleLinkClick}
                >
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/services"
                  className="nav-link"
                  onClick={handleLinkClick}
                >
                  Services
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/contact"
                  className="nav-link"
                  onClick={handleLinkClick}
                >
                  Contact
                </Link>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setShowLogin(true);
                    setShowDashboard(false);
                  }}
                >
                  Login
                </button>
              </li>
              <li className="nav-item">
                <Link
                  to="/analytics"
                  className="nav-link"
                  onClick={() => setShowDashboard(true)}
                >
                  Analytics
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/chat"
                  className="nav-link"
                  onClick={handleLinkClick}
                >
                  Chat
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <Login showLogin={showLogin} setShowLogin={setShowLogin} />
      </nav>
      {showDashboard && <FullDashboard />}
    </>
  );
};

export default Nav;
