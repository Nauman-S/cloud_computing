const BASE_URL = `${process.env.REACT_APP_API_INGRESS_PROTOCOL}://${process.env.REACT_APP_API_INGRESS_HOST}:${process.env.REACT_APP_API_INGRESS_PORT}`;
const PATENT_DATA_BASE_URL = "http://cs5224.ap-southeast-1.elasticbeanstalk.com:80/service/patent";
// const PATENT_DATA_BASE_URL = "/service/patent";

const URLs = {
  LOGIN: `${BASE_URL}/service/user/login`,
  SIGNUP: `${BASE_URL}/service/user/signup`,
  HEALTHZ: `${BASE_URL}/service/user/id`,
  LOGOUT: `${BASE_URL}/service/user/logout`,

  SEARCH: `${BASE_URL}/service/`,

  // Patent Data APIs (Using PATENT_BASE_URL)
  PATENT_BY_STATUS: `${PATENT_DATA_BASE_URL}?groupBy=status&aggregate=count`,
  PATENT_BY_APPLICANT: `${PATENT_DATA_BASE_URL}?groupBy=applicantName&aggregate=count`,
  PATENT_BY_COUNTRY: `${PATENT_DATA_BASE_URL}?groupBy=country&aggregate=count`,
  PATENT_BY_YEAR: `${PATENT_DATA_BASE_URL}?groupBy=year&aggregate=count`,
  PATENT_BY_IPC: `${PATENT_DATA_BASE_URL}?groupBy=ipc&aggregate=count`,
};

export default URLs;
