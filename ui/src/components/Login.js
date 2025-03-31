import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import OAuthLoginButtons from "./oAuth2/OAuthButton";
import "./Login.css";
const Login = ({ showLogin, setShowLogin }) => {

  return (
    <Modal show={showLogin} onHide={() => setShowLogin(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
       <OAuthLoginButtons onLoginSuccess={() => console.log("Logged in with GitHub")} />
      </Modal.Body>
      <Modal.Footer>
      <div style={{ width: '100%', textAlign: 'center' }}>
        <Button variant="primary" onClick={() => setShowLogin(false)}>
          <Link to="/signup" className="nav-link">
            Sign Up here!
          </Link>
        </Button>
      </div>  
      </Modal.Footer>
    </Modal>
  );
};

export default Login;
