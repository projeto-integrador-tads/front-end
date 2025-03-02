import { AxiosResponse } from "axios";
import api from "../index";
import { AUTH_ENDPOINTS } from "../endpoints";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  id: string;
  name: string;
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyResetCodeRequest {
  email: string;
  resetCode: string;
}

export interface ResetPasswordRequest {
  email: string;
  resetCode: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const authService = {
  login: async (data: LoginRequest): Promise<AxiosResponse<LoginResponse>> => {
    return api.post(AUTH_ENDPOINTS.LOGIN, data);
  },

  forgotPassword: async (
    data: ForgotPasswordRequest
  ): Promise<AxiosResponse<void>> => {
    return api.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, data);
  },

  verifyResetCode: async (
    data: VerifyResetCodeRequest
  ): Promise<AxiosResponse<void>> => {
    return api.post(AUTH_ENDPOINTS.VERIFY_RESET_CODE, data);
  },

  resetPassword: async (
    data: ResetPasswordRequest
  ): Promise<AxiosResponse<void>> => {
    return api.post(AUTH_ENDPOINTS.RESET_PASSWORD, data);
  },

  changePassword: async (
    data: ChangePasswordRequest
  ): Promise<AxiosResponse<void>> => {
    return api.post(AUTH_ENDPOINTS.CHANGE_PASSWORD, data);
  },
};
