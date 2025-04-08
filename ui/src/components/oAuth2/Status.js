import React, { useEffect, useState } from "react";
import axios from "axios";
import URLs from "../../constants/urls";
import generateToken from "../../utils/generateToken";

const Status = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [reload, setReload] = useState(false);

  const handleLogout = async () => {
    const csrfToken = localStorage.getItem("csrfToken");
    // console.log(csrfToken);
    if (!csrfToken) {
      setError("Failed to log out. Not logged in.");
      return;
    }
    try {
      await axios.post(
        URLs.OAUTH_USERLOGOUT,
        {},
        {
          withCredentials: true,
          headers: {
            "X-XSRF-TOKEN": csrfToken,
          },
        }
      );
      localStorage.removeItem("csrfToken");
    } catch (err) {
      console.error("Logout failed:", err);
      setError("Failed to log out. Please try again.");
    }
    setReload(!reload);
  };
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(URLs.OAUTH_USERINFO, {
          withCredentials: true,
        });
        if (response.data["X-CSRF"]) {
          localStorage.setItem(
            "csrfToken",
            generateToken(response.data["X-CSRF"])
          );
        }
        setUserInfo(response.data);
      } catch (err) {
        console.log(err);
        setError("Failed to fetch user info. Please try again.");
      }
    };
    fetchUserInfo();
  }, [reload]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User Info</h1>
      <ul>
        {Object.entries(userInfo).map(([key, value]) => (
          <li key={key}>
            <strong>{key}:</strong>{" "}
            {typeof value === "object"
              ? JSON.stringify(value)
              : value.toString()}
          </li>
        ))}
      </ul>
      <button
        onClick={handleLogout}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "red",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Status;
