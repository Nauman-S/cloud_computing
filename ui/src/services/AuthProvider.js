import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import URLs from "../constants/urls";
import generateToken from "../utils/generateToken";
import { useError } from "./ErrorProvider";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const { showError } = useError();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(URLs.OAUTH_USERINFO, { withCredentials: true })
      .then((res) => {
        if (res.data?.authenticated && res.data["X-CSRF"]) {
          localStorage.setItem("csrfToken", generateToken(res.data["X-CSRF"]));
        } else {
          localStorage.removeItem("csrfToken");
        }
        setUserInfo(res.data);
      })
      .catch(() => setUserInfo(null))
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    console.log("Logging out");
    const csrfToken = localStorage.getItem("csrfToken");
    if (!csrfToken) {
      showError("Failed to log out. Not logged in.");
      return;
    }
    axios
      .post(
        URLs.OAUTH_USERLOGOUT,
        {},
        {
          withCredentials: true,
          headers: {
            "X-XSRF-TOKEN": csrfToken,
          },
        }
      )
      .then(() => console.log("Successfully Logged out."))
      .catch(() => showError("Failed to log out. Not logged in."))
      .finally(() => {
        setUserInfo(null);
      });
  };

  return (
    <AuthContext.Provider value={{ userInfo, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for accessing auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
