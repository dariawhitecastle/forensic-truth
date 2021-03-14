import axios from 'axios';
import * as R from 'ramda';
import http from './http';

const baseURL = process.env.REACT_APP_BASE_URL || window.location.origin;
// TODO: handle errors

export const submitNotes = async (submissionNotes) => {
  try {
    await axios.post(`${baseURL}/api/note`, submissionNotes);
    return true;
  } catch (err) {
    throw err;
  }
};

export const submitReport = async (reportNotes) => {
  try {
    await axios.post(`${baseURL}/api/report`, reportNotes);
    return true;
  } catch (err) {
    throw err;
  }
};
