import axios from 'axios';
import { Project } from '../models/Project';

const apiUrl = 'http://localhost:3000';

export const getProjects = async (): Promise<Project[]> => {
  const response = await axios.get(`${apiUrl}/projects`);
  return response.data;
};

export const getProjectById = async (_id: string): Promise<Project> => {
  const response = await axios.get(`${apiUrl}/projects/${_id}`);
  return response.data;
};

export const addProject = async (project: Project): Promise<Project> => {
  const response = await axios.post(`${apiUrl}/projects`, project);
  return response.data;
};

export const updateProject = async (_id: string, project: Project): Promise<Project> => {
  const response = await axios.put(`${apiUrl}/projects/${_id}`, project);
  return response.data;
};

export const deleteProject = async (_id: string): Promise<void> => {
  await axios.delete(`${apiUrl}/projects/${_id}`);
};
