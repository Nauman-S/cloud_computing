import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useAuth } from "../services/AuthProvider";

const LogoutPopup = ({ show, handleClose }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    handleClose();
    logout();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Logout</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to logout?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="outline-danger" onClick={handleLogout}>
          Logout
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LogoutPopup;
