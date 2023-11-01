import axios from 'axios';


const api = axios.create({
  // baseURL: 'http://172.16.244.40:84/api', // testing server URL
  baseURL: "http://172.16.244.40:85/api"      // production server URL
});

export const login = async (
  userName: string,
  userPassword: string
): Promise<any> => {
  try {
    const response = await api.post('/Login', {
      userName: userName,
      userPassword: userPassword
    });
    return response.data; // Return the response data from the API
  } catch (error) {
    throw error; // Throw an error if the API call fails
  }
};