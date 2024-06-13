import axios from 'axios';
import { Story } from '../models/Story';

const API_URL = 'http://localhost:3000';

export const getStoriesByProject = async (projectId: string): Promise<Story[]> => {
    const response = await axios.get<Story[]>(`${API_URL}/stories`, {
        params: { projectId }
    });
    return response.data;
};

export const getStoryById = async (id: string): Promise<Story> => {
    const response = await axios.get<Story>(`${API_URL}/stories/${id}`);
    return response.data;
};

export const addStory = async (story: Story): Promise<Story> => {
    const response = await axios.post<Story>(`${API_URL}/stories`, story);
    return response.data;
};

export const updateStory = async (id: string, story: Story): Promise<Story> => {
    const response = await axios.put<Story>(`${API_URL}/stories/${id}`, story);
    return response.data;
};

export const deleteStory = async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/stories/${id}`);
};
