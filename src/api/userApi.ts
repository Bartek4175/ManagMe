import axios from 'axios';
import { User } from '../models/User';

const API_URL = 'http://localhost:3000';

export const getUsers = async (): Promise<User[]> => {
    const response = await axios.get<User[]>(`${API_URL}/users`);
    return response.data;
};

export const getUserById = async (id: string): Promise<User> => {
    const response = await axios.get<User>(`${API_URL}/users/${id}`);
    return response.data;
};

export const getIdByLogin = async (login: string): Promise<User> => {
    const response = await axios.get<User>(`${API_URL}/users/login/${login}`);
    return response.data;
};