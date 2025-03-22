const BASE_URL = `${process.env.REACT_APP_API_INGRESS_PROTOCOL}://${process.env.REACT_APP_API_INGRESS_HOST}:${process.env.REACT_APP_API_INGRESS_PORT}`;
const PATENT_DATA_BASE_URL = "https://ipos.naumansajid.com/service/patent";
const CHAT_BASE_URL = "https://ipos.naumansajid.com/service/chat";
// const PATENT_DATA_BASE_URL = "/service/patent";

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

  CHAT_MOCK_STREAM: `${CHAT_BASE_URL}/stream/mock`,
};

export default URLs;
