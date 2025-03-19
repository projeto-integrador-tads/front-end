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

export interface PersonalUserReport {
  personalData: {
    id: string;
    name: string;
    last_name: string;
    email: string;
    phone_number: string | null;
    profile_picture: string | null;
    createdAt: Date;
    is_driver: boolean;
    average_rating: number | null;
  };
  savedAddresses: {
    id: string;
    formattedAddress: string;
    city: string;
    createdAt: Date;
  }[];
  ridesAsDriver: {
    ride_id: string;
    start_time: Date;
    end_time: Date | null;
    price: number;
    status: string;
    startAddress: string;
    endAddress: string;
    createdAt: Date;
  }[];
  ridesAsPassenger: {
    ride_id: string;
    start_time: Date;
    end_time: Date | null;
    price: number;
    status: string;
    startAddress: string;
    endAddress: string;
    reservation_status: string;
    payment_status: string;
    createdAt: Date;
  }[];
  vehicles: {
    vehicle_id: string;
    brand: string;
    model: string;
    year: number;
    license_plate: string;
    color: string;
    seats: number;
    active: boolean;
    createdAt: Date;
  }[];
  reviewsGiven: {
    review_id: string;
    ride_id: string;
    reviewee_id: string;
    reviewee_name: string;
    rating: number;
    comment: string | null;
    createdAt: Date;
  }[];
  reviewsReceived: {
    review_id: string;
    ride_id: string;
    reviewer_id: string;
    reviewer_name: string;
    rating: number;
    comment: string | null;
    createdAt: Date;
  }[];
  messages: {
    message_id: string;
    content: string;
    sender_id: string;
    sender_name: string;
    receiver_id: string;
    receiver_name: string;
    ride_id: string | null;
    createdAt: Date;
  }[];
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

  async getProfilePictureById(userId: string): Promise<ProfilePictureResponse> {
    const response = await api.get<ProfilePictureResponse>(USER_ENDPOINTS.GET_PICTURE_BY_ID(userId));
    return response.data;
  }

  async deleteProfilePicture(): Promise<void> {
    await api.delete(USER_ENDPOINTS.DELETE_PICTURE);
  }

  async deleteAccount(): Promise<void> {
    await api.delete(USER_ENDPOINTS.DELETE);
  }

  async getPersonalReport(): Promise<PersonalUserReport> {
    try {
      const response = await api.get<PersonalUserReport>(USER_ENDPOINTS.REPORT);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const userService = new UserService(); 