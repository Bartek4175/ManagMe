import axios from 'axios';

const API_URL = 'http://localhost:3000';

interface User {
  _id: string;
  login: string;
  firstName: string;
  lastName: string;
  role: string;
}

export const registerUser = async (user: {
  login: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'devops' | 'developer';
}): Promise<void> => {
  await axios.post(`${API_URL}/auth/register`, user);
};

export const loginUser = async (credentials: {
  login: string;
  password: string;
}): Promise<{ token: string; refreshToken: string; user: User }> => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  //console.log(response.data)
  return response.data;
};

export const googleLogin = async (token: string): Promise<{ token: string; refreshToken: string; user: User }> => {
  const response = await axios.post(`${API_URL}/auth/google-login`, { token });
  return response.data;
};
