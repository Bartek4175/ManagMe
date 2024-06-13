import axios from 'axios';
import { Task } from '../models/Task';

const API_URL = 'http://localhost:3000/tasks';

export const getTasksByStory = async (storyId: string): Promise<Task[]> => {
  const response = await axios.get(`${API_URL}/story/${storyId}`);
  return response.data;
};

export const getTaskById = async (id: string): Promise<Task> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const addTask = async (task: Task): Promise<Task> => {
  const response = await axios.post(API_URL, task);
  return response.data;
};

export const updateTask = async (id: string, task: Task): Promise<Task> => {
  const response = await axios.put(`${API_URL}/${id}`, task);
  return response.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};