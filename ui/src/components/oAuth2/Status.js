import React, { useEffect, useState } from "react";
import axios from "axios";
import URLs from "../../constants/urls";

const Status = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [reload, setReload] = useState(false);
  // FUNCTIONS TO HANDLE CONVERSION OF CSRF TOKEN - START
  function base64URLencode(bytes) {
    const base64Encoded = btoa(String.fromCharCode(...bytes));
    return base64Encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  
  function xorBytes(a, b) {
    if (a.length !== b.length) {
      throw new Error('Byte arrays must be of equal length');
    }
    const result = new Uint8Array(a.length);
    for (let i = 0; i < a.length; i++) {
      result[i] = a[i] ^ b[i];
    }
    return result;
  }
  
  function generateToken(token) {
    const tokenBytes = new TextEncoder().encode(token);
    
    const randomBytes = crypto.getRandomValues(new Uint8Array(tokenBytes.length));

    const xoredBytes = xorBytes(randomBytes, tokenBytes);
    
    const combinedBytes = new Uint8Array(randomBytes.length + xoredBytes.length);
    combinedBytes.set(randomBytes, 0);
    combinedBytes.set(xoredBytes, randomBytes.length);

    return base64URLencode(combinedBytes);
  }
  // FUNCTIONS TO HANDLE CONVERSION OF CSRF TOKEN - END
  

  const handleLogout = async () => {
    const csrfToken = localStorage.getItem("csrfToken");
    // console.log(csrfToken);
    if (!csrfToken) {
      setError("Failed to log out. Not logged in.");
      return
    }
    try {    
        const response = await axios.post(URLs.OAUTH_USERLOGOUT, { },
          {withCredentials: true,
            headers: {
              'X-XSRF-TOKEN': csrfToken,
            }
        });
        localStorage.removeItem("csrfToken");
        console.log("LOGGED OUT SUCCESSFULLY");
        

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
                  localStorage.setItem("csrfToken", generateToken(response.data["X-CSRF"]));
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
            <strong>{key}:</strong> {typeof value === "object" ? JSON.stringify(value) : value.toString()}
          </li>
        ))}
      </ul>
      <button onClick={handleLogout} style={{ marginTop: "20px", padding: "10px 20px", backgroundColor: "red", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
        Logout
      </button>
    </div>
  );
};

export default Status;
