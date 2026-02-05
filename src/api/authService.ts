import apiClient from './apiClient';
import { storage } from '../utils/storage';
import type { AuthResponse, LoginCredentials, RegisterCredentials } from './types';

export const authService = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
        const { access_token } = response.data;
        storage.setToken(access_token);
        return response.data;
    },

    register: async (credentials: RegisterCredentials): Promise<void> => {
        await apiClient.post('/auth/register', credentials);
    },

    logout: (): void => {
        storage.clearToken();
        window.location.href = '/login';
    },

    isAuthenticated: (): boolean => {
        return !!storage.getToken();
    },
};
