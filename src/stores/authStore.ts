// src/stores/authStore.ts
import { create } from 'zustand';
import apiClient from '@/lib/api';
import type { User } from '@/types';

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
		console.log('🔐 LOGIN:', { username });

		try {
			// ✅ Ahora usa apiClient en lugar de fetch
			await apiClient.post('/auth/login', {
				username,
				password,
			});

			// Login exitoso, verificar autenticación
			await get().checkAuth();
		} catch (error: any) {
			const message = error.response?.data?.message || 'Error al iniciar sesión';
			throw new Error(message);
		}
	},

	logout: async () => {
		try {
			await apiClient.post('/auth/logout');
		} catch (error) {
			console.error('Error en logout:', error);
		} finally {
			// Limpiar estado incluso si falla
			set({ user: null, isAuthenticated: false });
		}
	},

	checkAuth: async () => {
		try {
			// ✅ Esta llamada usará el interceptor si el token expira
			const response = await apiClient.get('/auth/me');

			console.log('✅ ME:', response.data);

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
			console.error('❌ Auth check failed:', error);
			set({ user: null, isAuthenticated: false, isLoading: false });
		}
	},
}));
