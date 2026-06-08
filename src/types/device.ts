export interface Device {
	id: string;
	androidId: string | null;
	equipo: string;
	modelo: string;
	usuario: string;
	correo: string;
	aliasUsuario: string | null;
	ipAddress?: string;
	macAddress?: string;

	// Estado en tiempo real (viene del backend)
	online?: boolean;
	appVersion?: number;
}
