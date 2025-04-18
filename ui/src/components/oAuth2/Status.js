import { useEffect, useState } from "react";
import axios from "axios";
import URLs from "../../constants/urls";
import generateToken from "../../utils/generateToken";
import { Avatar, Card, CardContent } from "@mui/material";
import verifiedImage from "../../assets/light-green-verified-badge.png";

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
      <h1>Profile</h1>
      <div className="flex items-start justify-start min-h-screen bg-gray-100 p-4">
        <Card className="w-full max-w-md rounded-2xl shadow-lg">
          <CardContent className="p-6 flex flex-col">
            <div className="p-6 flex flex-row">
              <Avatar className="w-24 h-24 mb-4"></Avatar>
              <h2 className="text-2xl font-semibold mb-1">{userInfo.name}</h2>
            </div>
            <div className="email-section p-3">
              <label className="fw-semibold d-block mb-1">Email</label>
              <div className="d-flex align-items-center mb-2">
                <span className="me-2">{userInfo.email}</span>
                {userInfo.email_verified && (
                  <span className="verified-badge">Verified</span>
                )}
              </div>
              <button className="btn btn-outline-primary btn-sm">
                Update email
              </button>
            </div>
            <div className="flex gap-2 mt-4"></div>
          </CardContent>
        </Card>
      </div>
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
