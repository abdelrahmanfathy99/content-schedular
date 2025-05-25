import axios from 'axios';
import { API_URL } from '../config';

export interface Platform {
  id: number;
  type: string;
}

export const getPlatforms = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/platforms`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data.platforms;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch platforms');
    }
    throw new Error('Network error. Please try again later.');
  }
};