import axios from 'axios';
import { API_URL } from '../config';

export interface Activity {
  id: number;
  log_name: string | null;
  description: string;
  subject_type: string | null;
  event: string | null;
  subject_id: number | null;
  causer_type: string | null;
  causer_id: number | null;
  properties: Record<string, any> | null;
  batch_uuid: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  status: 'draft' | 'scheduled' | 'published';
  scheduled_time: string | null;
  platforms: number[];
  created_at: string;
  updated_at: string;
  activities?: Activity[];
}

export interface PostFilter {
  title?: string;
  status?: ('draft' | 'scheduled' | 'published')[];
  is_published?: boolean;
  scheduled_date?: string;
  platform_ids?: number[];
  page?: number;
  per_page?: number;
}

export interface DashboardStats {
  total: number;
  published: number;
  scheduled: number;
  draft: number;
  current_month_count: number;
  success_rate: number;
}

export interface platformStats {
  facebook: number;
  twitter: number;
  linkedin: number;
  instagram: number;
}

export const getDashboardStats = async (token: string): Promise<DashboardStats> => {
  try {
    const response = await axios.get(`${API_URL}/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch dashboard stats');
    }
    throw new Error('Network error. Please try again later.');
  }
};

export const getPlatformStats = async (token: string): Promise<platformStats> => {
  try {
    const response = await axios.get(`${API_URL}/platform`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch platform stats');
    }
    throw new Error('Network error. Please try again later.');
  }
};

export const getPosts = async (token: string, filters: PostFilter = {}) => {
  try {
    const response = await axios.get(`${API_URL}/user/post`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: filters
    });
    console.log('Fetched posts:', response.data);
    
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch posts');
    }
    throw new Error('Network error. Please try again later.');
  }
};

export const getPost = async (token: string, id: number) => {
  try {
    const response = await axios.get(`${API_URL}/user/post/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch post');
    }
    throw new Error('Network error. Please try again later.');
  }
};

export const createPost = async (
  token: string,
  title: string,
  content: string,
  status: 'draft' | 'scheduled' | 'published',
  platform_ids: number[],
  scheduled_time?: string
) => {
  try {
    const postData: any = {
      title,
      content,
      status,
      platform_ids
    };

    if (status === 'scheduled' && scheduled_time) {
      postData.scheduled_time = scheduled_time;
    }

    const response = await axios.post(
      `${API_URL}/user/post`,
      postData,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to create post');
    }
    throw new Error('Network error. Please try again later.');
  }
};

export const updatePost = async (
  token: string,
  id: number,
  title: string,
  content: string,
  status: 'draft' | 'scheduled' | 'published',
  platform_ids: number[],
  scheduled_time?: string
) => {
  try {
    const postData: any = {
      title,
      content,
      status,
      platform_ids
    };

    if (status === 'scheduled' && scheduled_time) {
      postData.scheduled_time = scheduled_time;
    }
    console.log(postData);
    
    const response = await axios.put(
      `${API_URL}/user/post/${id}`,
      postData,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to update post');
    }
    throw new Error('Network error. Please try again later.');
  }
};

export const deletePost = async (token: string, id: number) => {
  try {
    await axios.delete(`${API_URL}/user/post/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to delete post');
    }
    throw new Error('Network error. Please try again later.');
  }
};