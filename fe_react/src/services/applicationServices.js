import axios from 'axios';

export const getQuestions = async () => {
  const baseURL = process.env.REACT_APP_BASE_URL;
  try {
    const response = await axios.get(`${baseURL}/question`);
    return response.data;
  } catch (err) {
    throw err;
  }
};
