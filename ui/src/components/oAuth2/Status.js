import { useEffect, useState } from "react";
import axios from "axios";
import URLs from "../../constants/urls";
import generateToken from "../../utils/generateToken";
import { useError } from "../../services/ErrorProvider";
import Notification from "../elements/Notification";

const Status = () => {
  const [userInfo, setUserInfo] = useState(null);
  const { showError, clearError } = useError();
  useEffect(() => {
    clearError();
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
        showError("Failed to fetch user info. Please try again.");
      }
    };
    fetchUserInfo();
  }, [clearError, showError]);

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">Profile</h1>
      <div className="d-flex justify-content-start align-items-start min-vh-100 bg-light p-3">
        <div
          className="card shadow-lg profile-card w-100"
          style={{ maxWidth: "700px" }}
        >
          <div className="card-body">
            <div className="d-flex align-items-center mb-4">
              <div className="profile-avatar me-3">
                <img src="" alt="" />
              </div>
              <h2 className="h4 mb-0">{userInfo.name}</h2>
            </div>
            <div className="email-section mb-3">
              <div className="d-flex align-items-center justify-start flex-wrap email-container">
                <div className="d-flex align-items-center flex-wrap">
                  <span className="fw-semibold me-2">Email: </span>
                  <span className="me-2 text-truncate email-text">
                    {userInfo.email}
                  </span>
                  {userInfo.email_verified && (
                    <span className="badge bg-success me-3">Verified</span>
                  )}
                </div>
              </div>
            </div>
            <Notification defaultEnabled={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Status;
