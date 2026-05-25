import { apiClient } from '@/lib/api';
import type { UserRole } from '@/lib/roles';

export interface UserDTO {
	id: number;
	username: string;
	role: UserRole;
}

export interface CreateUserPayload {
	username: string;
	password: string;
	role: UserRole;
}

export interface UpdateUserPayload {
	username?: string;
	role?: UserRole;
}

export interface UpdatePasswordPayload {
	oldPassword: string;
	newPassword: string;
}

export const usersApi = {
	getAll: async (): Promise<UserDTO[]> => {
		const res = await apiClient.get('/admin/users');
		return res.data;
	},

	getById: async (id: number): Promise<UserDTO> => {
		const res = await apiClient.get(`/admin/users/${id}`);
		return res.data;
	},

	create: async (payload: CreateUserPayload): Promise<void> => {
		await apiClient.post('/admin/users', payload);
	},

	update: async (id: number, payload: UpdateUserPayload): Promise<void> => {
		await apiClient.patch(`/admin/users/${id}`, payload);
	},

	updatePassword: async (id: number, payload: UpdatePasswordPayload): Promise<void> => {
		await apiClient.put(`/admin/users/${id}`, payload);
	},

	delete: async (id: number): Promise<void> => {
		await apiClient.delete(`/admin/users/${id}`);
	},
};
