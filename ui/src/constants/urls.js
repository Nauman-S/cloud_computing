const BASE_URL = `${process.env.REACT_APP_API_INGRESS_PROTOCOL}://${process.env.REACT_APP_API_INGRESS_HOST}:${process.env.REACT_APP_API_INGRESS_PORT}`;
const BASE_SERVICE = "https://ipos.naumansajid.com/service"
// const BASE_SERVICE = "http://localhost:8080/service"
const PATENT_DATA_BASE_URL = "https://ipos.naumansajid.com/service/patent";
// const PATENT_DATA_BASE_URL = "http://localhost:8080/service/patent";
// const CHAT_BASE_URL = "http://localhost:8080/service/chat";
const CHAT_BASE_URL = "https://ipos.naumansajid.com/service/chat";

const URLs = {
  LOGIN: `${BASE_URL}/service/user/login`,
  SIGNUP: `${BASE_URL}/service/user/signup`,
  HEALTHZ: `${BASE_URL}/service/user/id`,
  LOGOUT: `${BASE_URL}/service/user/logout`,

  // Patent Data APIs (Using PATENT_BASE_URL)
  PATENT_BY_STATUS: `${PATENT_DATA_BASE_URL}?groupBy=status&aggregate=count`,
  PATENT_BY_APPLICANT: `${PATENT_DATA_BASE_URL}?groupBy=applicantName&aggregate=count`,
  PATENT_BY_COUNTRY: `${PATENT_DATA_BASE_URL}?groupBy=country&aggregate=count`,
  PATENT_BY_YEAR: `${PATENT_DATA_BASE_URL}?groupBy=year&aggregate=count`,
  PATENT_BY_IPC: `${PATENT_DATA_BASE_URL}?groupBy=ipc&aggregate=count`,

  //OAUTH
  // OAUTH_GITHUB: `${BASE_SERVICE}/oauth2/authorization/github`,
  OAUTH_SET_REDIRECT: `${BASE_SERVICE}/user/redirect`,
  OAUTH_GOOGLE: `${BASE_SERVICE}/oauth2/authorization/google`,
  OAUTH_GITHUB: `${BASE_SERVICE}/oauth2/authorization/github`,
  OAUTH_USERINFO: `${BASE_SERVICE}/user/info`,
  OAUTH_USERLOGOUT: `${BASE_SERVICE}/user/logout`,

  //CHAT
  CHAT_MOCK_STREAM: `${CHAT_BASE_URL}/stream/mock`,
  CHAT_STREAM: `${CHAT_BASE_URL}/stream`,

  //SEARCH
  SEARCH: `${PATENT_DATA_BASE_URL}/search`,
};

export default URLs;
