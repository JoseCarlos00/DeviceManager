/**
 * Respuesta estándar de la API
 */
export interface ApiResponse<T = any> {
	success: boolean;
	data?: T;
	message?: string;
	error?: string;
	errors?: Record<string, string[]>;
}

/**
 * Respuesta paginada
 */
export interface PaginatedResponse<T> {
	success: boolean;
	data: T[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNext: boolean;
		hasPrev: boolean;
	};
}

/**
 * Opciones de pagination
 */
export interface PaginationParams {
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: 'asc' | 'desc';
}

/**
 * Filtros de búsqueda
 */
export interface SearchParams {
	query?: string;
	filters?: Record<string, any>;
}

/**
 * Estado de solicitud
 */
export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Error de API
 */
export interface ApiError {
	message: string;
	code?: string;
	status?: number;
	errors?: Record<string, string[]>;
}
