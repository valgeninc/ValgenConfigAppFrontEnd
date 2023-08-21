import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:3030',
});

export const login = async (
  username: string,
  password: string
): Promise<any> => {
  try {
    const response = await api.get("/users", {
      params: { username, password },
    });

    const user = response.data[0];
    if (user) {
      return {
        status: "OK",
        result: {
          userToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6ImNhMWRhNmVjLTljNWMtNGIyOS04OTAwLWYyYjYzNDUzYWJmNiIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWVpZGVudGlmaWVyIjoiVGVzdCIsImV4cCI6MTY5MjI2ODU5NywiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NzI3NC8iLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdDo3Mjc0LyJ9.xNNs3bvvnyrt_7VjP11ptDV_6GaUgXb_WXP-k9zUFok", // Use the user's id as a mock token
        },
        error: null,
      };
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    return {
      status: "ERROR",
      result: null,
      // error: error.message,
    };
  }
};