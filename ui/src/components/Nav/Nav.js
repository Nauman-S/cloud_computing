import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import Login from "../Login"

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  return (
    <nav className="navbar navbar-expand-md navbar-light bg-light shadow-sm p-3">
      <div className="container-fluid">
        <h1 className="navbar-brand">Logo</h1>
        <button className="navbar-toggler" type="button" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item"><Link to="/" className="nav-link">Home</Link></li>
            <li className="nav-item"><Link to="/about" className="nav-link">About</Link></li>
            <li className="nav-item"><Link to="/services" className="nav-link">Services</Link></li>
            <li className="nav-item"><Link to="/contact" className="nav-link">Contact</Link></li>
            <li className="nav-item"><button className="btn btn-primary" onClick={() => setShowLogin(true)}>Login</button></li>
          </ul>
        </div>
      </div>
      <Login showLogin={showLogin} setShowLogin={setShowLogin}></Login>
      
      {/* <Modal show={showLogin} onHide={() => setShowLogin(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
         <Login></Login>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogin(false)}>Close</Button>
          <Button variant="primary">Login</Button>
        </Modal.Footer>
      </Modal> */}
    </nav>
  );
};

export default Nav;
