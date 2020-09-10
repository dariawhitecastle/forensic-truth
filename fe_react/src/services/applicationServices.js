import axios from 'axios';

export const getQuestions = async () => {
  const baseURL = process.env.REACT_APP_BASE_URL || window.location.origin;

  try {
    const response = await axios.get(`${baseURL}/api/question`);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const authenticate = async (credentials) => {
  const baseURL = process.env.REACT_APP_BASE_URL || window.location.origin;
  try {
    const response = await axios.post(
      `${baseURL}/api/examiner/login`,
      credentials
    );
    sessionStorage.setItem('jwt', response.accessToken);
    return true;
  } catch (err) {
    throw err;
  }
};

export const registerUser = async (credentials) => {
  console.log(credentials);
  const baseURL = process.env.REACT_APP_BASE_URL || window.location.origin;
  try {
    await axios.post(`${baseURL}/api/create-user`, credentials);
    return true;
  } catch (err) {
    throw err;
  }
};
