const BASE_URL = `${process.env.REACT_APP_API_INGRESS_PROTOCOL}://${process.env.REACT_APP_API_INGRESS_HOST}:${process.env.REACT_APP_API_INGRESS_PORT}`;
const URLs = {
    LOGIN: `${BASE_URL}/service/user/login`,
    SIGNUP: `${BASE_URL}/service/user/signup`,
    HEALTHZ: `${BASE_URL}/service/user/id`,
    LOGOUT: `${BASE_URL}/service/user/logout`,
  };

export default URLs