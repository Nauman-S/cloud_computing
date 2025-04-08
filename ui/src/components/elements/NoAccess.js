import { useState } from "react";
import Login from "../Login";

const NoAccess = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "70vh" }}
    >
      <div className="text-center">
        <h3 className="mb-3">You're not logged in</h3>
        <p className="mb-4">
          To access this page, please log in with your account.
        </p>
        <button
          className="btn btn-outline-primary"
          onClick={() => {
            setShowLogin(true);
          }}
        >
          Login
        </button>
        <Login showLogin={showLogin} setShowLogin={setShowLogin} />
      </div>
    </div>
  );
};

export default NoAccess;
