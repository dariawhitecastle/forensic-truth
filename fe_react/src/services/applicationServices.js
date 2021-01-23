import axios from 'axios';
import * as R from 'ramda';

const baseURL = process.env.REACT_APP_BASE_URL || window.location.origin;
// TODO: handle errors

export const getQuestions = async () => {
  try {
    const response = await axios.get(`${baseURL}/api/question`);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const submitApplication = async (personalData) => {
  const answer = personalData.map((item) =>
    item.question > 200 ? { ...item, question: R.take(2, item.question) } : item
  );
  // TODO: add real caseID here
  var today = new Date();
  var date = today.toLocaleDateString();
  const payload = {
    caseId: 1,
    date,
    answer,
  };
  try {
    const response = await axios.post(`${baseURL}/api/submissions`, payload);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const fetchAllSubmissions = async () => {
  try {
    const response = await axios.get(`${baseURL}/api/all-submissions`);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const fetchSubmission = async (id) => {
  try {
    const response = await axios.get(`${baseURL}/api/submissions?id=${id}`);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const authenticate = async (credentials) => {
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
  try {
    await axios.post(`${baseURL}/api/create-user`, credentials);
    return true;
  } catch (err) {
    throw err;
  }
};

export const submitNotes = async (submissionNotes) => {
  try {
    await axios.post(`${baseURL}/api/note`, submissionNotes);
    return true;
  } catch (err) {
    throw err;
  }
};
