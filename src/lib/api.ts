import axios from 'axios';

// Cliente público: sin interceptores, para endpoints como login/register.
const publicApiClient = axios.create({
	baseURL: '/api',
	withCredentials: true,
	timeout: 10000,
});

// Cliente autenticado: con interceptor para manejar la renovación de tokens.
const apiClient = axios.create({
	baseURL: '/api',
	withCredentials: true,
	timeout: 10000,
});

// Estado para evitar múltiples refreshes simultáneos
let isRefreshing = false;
let failedQueue: Array<{
	resolve: (value?: any) => void;
	reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
	failedQueue.forEach((promise) => {
		if (error) {
			promise.reject(error);
		} else {
			promise.resolve(token);
		}
	});

	failedQueue = [];
};

// Interceptor de respuesta
apiClient.interceptors.response.use(
	// Si la respuesta es exitosa, devolverla tal cual
	(response) => response,

	// Si hay error, verificar si es 401 (token expirado)
	async (error) => {
		const originalRequest = error.config;

		// Verificar si es la llamada de refresh (evitar loop infinito)
		const isRefreshCall = originalRequest.url?.includes('/auth/refresh');

		// Si es 401 y no es refresh call y no hemos reintentado
		if (
			(error.response?.status === 401 || error.response?.status === 403) &&
			!originalRequest._retry &&
			!isRefreshCall
		) {
			// Si ya hay un refresh en proceso, agregar a la cola
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then(() => {
						// Cuando el refresh termine, reintentar request original
						return apiClient(originalRequest);
					})
					.catch((err) => {
						return Promise.reject(err);
					});
			}

			// Marcar que vamos a intentar refresh
			originalRequest._retry = true;
			isRefreshing = true;

			console.log('🔄 [Interceptor] Token expirado, refrescando...');

			try {
				// ⭐ Llamar al endpoint de refresh
				const refreshResponse = await apiClient.post('/auth/refresh');

				if (refreshResponse.status === 200) {
					console.log('✅ [Interceptor] Refresh exitoso');

					// El nuevo accessToken ya está en la cookie httpOnly
					// Procesar requests en cola
					processQueue(null, 'success');

					// ⭐ Reintentar el request original
					return apiClient(originalRequest);
				}
			} catch (refreshError) {
				console.error('❌ [Interceptor] Refresh falló:', refreshError);

				// Refresh falló → procesar cola con error
				processQueue(refreshError, null);

				// Solo redirigir si no estamos ya en la página de login para evitar bucles
				if (window.location.pathname !== '/login') {
					window.location.href = '/login?error=session_expired';
				}

				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}

		// Si no es 401 o ya intentamos refrescar, rechazar
		return Promise.reject(error);
	}
);

export { publicApiClient, apiClient }
