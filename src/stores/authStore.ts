// src/stores/authStore.ts
import { create } from 'zustand';
import { apiClient, publicApiClient } from '@/lib/api';
import type { User } from '@/types';
import { isAxiosError } from 'axios';

interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;

	login: (username: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
	user: null,
	isAuthenticated: false,
	isLoading: true,

	login: async (username: string, password: string) => {
		try {
			await publicApiClient.post('/auth/login', {
				username: username.toLocaleUpperCase(),
				password,
			});

			// Login exitoso, verificar autenticación
			await get().checkAuth();
		} catch (error) {
			set({ user: null, isAuthenticated: false, isLoading: false });
			if (isAxiosError(error) && error.response?.data?.message === 'Credenciales inválidas') {
				throw new Error('El usuario o la contraseña son incorrectos.');
			}			
			
 			throw new Error('Ocurrió un error inesperado. Por favor, inténtalo de nuevo.');
		}
	},

	logout: async () => {
		try {
			await publicApiClient.post('/auth/logout');
		} catch (error) {
			console.error('Error en logout:', error);
		} finally {
			set({ user: null, isAuthenticated: false });
		}
	},

	checkAuth: async () => {
		try {
			const response = await apiClient.get('/auth/me');

			if (response.data.user) {
				set({
					user: response.data.user,
					isAuthenticated: true,
					isLoading: false,
				});
			} else {
				set({ user: null, isAuthenticated: false, isLoading: false });
			}
		} catch (error) {
			set({ user: null, isAuthenticated: false, isLoading: false });
			if (isAxiosError(error)) {
				console.error(error.response?.data);
			}
		}
	},
}));
