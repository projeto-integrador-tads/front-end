import api from '../index';
import { USER_ENDPOINTS } from '../endpoints';

export interface User {
  id: string;
  name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  active: boolean;
  is_driver: boolean;
  average_rating: number | null;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    last_name: string;
    email: string;
  };
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  last_name: string;
  phone_number?: string;
}

export interface ProfilePictureResponse {
  url: string;
}

class UserService {
  async register(data: RegisterData): Promise<User> {
    const response = await api.post<User>('/register', data);
    return response.data;
  }

  async getById(id: string): Promise<User> {
    const response = await api.get<User>(USER_ENDPOINTS.GET_BY_ID(id));
    return response.data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/login', { email, password });
    return response.data;
  }

  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    const response = await api.put<User>(USER_ENDPOINTS.UPDATE, data);
    return response.data;
  }

  async uploadProfilePicture(formData: FormData): Promise<void> {
    await api.post(USER_ENDPOINTS.UPLOAD_PICTURE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async getProfilePicture(): Promise<ProfilePictureResponse> {
    const response = await api.get<ProfilePictureResponse>(USER_ENDPOINTS.GET_PICTURE);
    return response.data;
  }

  async deleteProfilePicture(): Promise<void> {
    await api.delete(USER_ENDPOINTS.DELETE_PICTURE);
  }

  async deleteAccount(): Promise<void> {
    await api.delete(USER_ENDPOINTS.DELETE);
  }
}

export const userService = new UserService(); 