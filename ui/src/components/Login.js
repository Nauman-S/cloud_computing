import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Login.css";
const Login = ({ showLogin, setShowLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  // const [isSignUp, setIsSignUp] = useState(false);

  const validateForm = () => {
    let formErrors = {};

    // Basic validation for email
    if (!email) {
      formErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      formErrors.email = "Email is invalid";
    }

    // Basic validation for password
    if (!password) {
      formErrors.password = "Password is required";
    } else if (password.length < 6) {
      formErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Logging in with:", { email, password });
      // Perform login logic here
    } else {
      console.log("Form has errors");
    }
  };
  return (
    <Modal show={showLogin} onHide={() => setShowLogin(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
       
        <form>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && <div className="text-danger">{errors.email}</div>}
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && (
              <div className="text-danger">{errors.password}</div>
            )}
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowLogin(false)}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {" "}
          Login
        </Button>
        Not Registered?
        <Button variant="primary" onClick={() => setShowLogin(false)}>
          <Link to="/signup" className="nav-link">
            Sign Up here!
          </Link>
        </Button>
        <div className="text-center mt-4"></div>
      </Modal.Footer>
    </Modal>
  );
};

export default Login;
