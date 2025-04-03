import URLs from "../../constants/urls";
import axios from "axios";

const googleLogin = async () => {
    try {
        const response = await axios.post(URLs.OAUTH_SET_REDIRECT,
        {
            redirectUrl: window.location.origin + "/status",
        },
        {
            withCredentials: true, // Ensure cookies are included
        });

        if (response.status === 200) {
            window.location.href = URLs.OAUTH_GOOGLE;
        } else {
            console.log(response);
        }

    } catch (error) {
        console.error("Error Configuring Redirect:", error);
    }
};

const githubLogin = async () => {
    try {
        const response = await axios.post(URLs.OAUTH_SET_REDIRECT,
        {
            redirectUrl: window.location.origin + "/status",
        },
        {
            withCredentials: true, // Ensure cookies are included
        });

        if (response.status === 200) {
            window.location.href = URLs.OAUTH_GITHUB;
        } else {
            console.log(response);
        }
      } catch (error) {
        console.error("Error Configuring Redirect:", error);
      }
    };

const prepareAxiosRequestConfig = () => {
    const csrfToken = localStorage.getItem("csrfToken");
    // console.log(csrfToken);
    if (!csrfToken) {
        console.error("CSRF token not found in local storage");
        return null;
    }
    let keyEnabled = false;
    keyEnabled = process.env.KEY_ENABLED;
    if (keyEnabled) {
        return {
            headers: { "X-TESTER-REQUEST": "tester_secret_api_key" },
            withCredentials: true,
        };
    } else {
        return {
            withCredentials: true,
        }
    }
}

export { googleLogin, githubLogin, prepareAxiosRequestConfig };