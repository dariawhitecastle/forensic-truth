import axios from 'axios'

export const getQuestions = async () => {
  try {
    const response = await axios.get('http://localhost:1337/question')
    return response.data
  } catch (err) {
    throw err
  }
}
