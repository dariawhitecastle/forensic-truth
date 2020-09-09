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

  console.log(credentials);
  try {
    const response = await axios.post(`${baseURL}/examiner/login`, credentials);
    // return response.data;
  } catch (err) {
    throw err;
  }
};
