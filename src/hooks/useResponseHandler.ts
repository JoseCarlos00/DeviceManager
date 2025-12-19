import { useCallback } from 'react';
import { toast } from 'sonner';
import { useLogStore } from '@/stores/historyLogs';
import type { CallbackResponse } from '@/types';

interface ResponseHandlerOptions {
	showToast?: boolean;
	addToLog?: boolean;
	successMessage?: string;
	errorMessage?: string;
	icon?: React.ReactNode;
}

export const useResponseHandler = () => {
	const addLog = useLogStore((state) => state.addLog);

	const handleResponse = useCallback(
		(response: CallbackResponse | null, options: ResponseHandlerOptions = {}) => {
			const { showToast = true, addToLog = true, successMessage, errorMessage, icon } = options;

			// Sin respuesta del servidor
			if (!response) {
				if (showToast) {
					toast.error('Sin respuesta del servidor', {
						description: 'Verifica tu conexión',
					});
				}
				if (addToLog) {
					addLog('Sin respuesta del servidor', 'error');
				}
				return null;
			}

			// Manejar según status
			switch (response.status) {
				case 'OK':
					if (showToast) {
						toast.success(successMessage || response.message, { icon });
					}
					if (addToLog) {
						addLog(response.message, 'success');
					}
					break;

				case 'ERROR':
					if (showToast) {
						toast.error(errorMessage || response.message, {
							description: response.data?.reason as string,
						});
					}
					if (addToLog) {
						addLog(response.message, 'error');
					}
					break;

				case 'WARN':
					if (showToast) {
						toast.warning(response.message);
					}
					if (addToLog) {
						addLog(response.message, 'warning');
					}
					break;

				case 'FORBIDDEN':
					if (showToast) {
						toast.error('Acción no permitida', {
							description: response.message,
						});
					}
					if (addToLog) {
						addLog('Acción no permitida: ' + response.message, 'error');
					}
					break;

				case 'UNAUTHORIZED':
					if (showToast) {
						toast.error('No autorizado', {
							description: 'Verifica tus permisos',
						});
					}
					if (addToLog) {
						addLog('No autorizado', 'error');
					}
					break;
			}

			return response;
		},
		[addLog]
	);

	return { handleResponse };
};
