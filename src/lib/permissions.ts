import { UserRole } from './roles';

/**
 * Permisos específicos del sistema
 */
export const PERMISSIONS = {
	// Dispositivos
	VIEW_DEVICES: 'view_devices',
	LOCATE_DEVICES: 'locate_devices',
	MANAGE_DEVICES: 'manage_devices',
	DELETE_DEVICES: 'delete_devices',

	// Usuarios
	VIEW_USERS: 'view_users',
	MANAGE_USERS: 'manage_users',
	DELETE_USERS: 'delete_users',

	// Reportes
	VIEW_REPORTS: 'view_reports',
	EXPORT_REPORTS: 'export_reports',

	// Sistema
	VIEW_LOGS: 'view_logs',
	SYSTEM_CONFIG: 'system_config',
	MANAGE_ROLES: 'manage_roles',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/**
 * Mapa de roles a permisos
 */
export const ROLE_PERMISSIONS_MAP: Record<UserRole, Permission[]> = {
	[UserRole.SUPER_ADMIN]: [
		PERMISSIONS.VIEW_DEVICES,
		PERMISSIONS.LOCATE_DEVICES,
		PERMISSIONS.MANAGE_DEVICES,
		PERMISSIONS.DELETE_DEVICES,
		PERMISSIONS.VIEW_USERS,
		PERMISSIONS.MANAGE_USERS,
		PERMISSIONS.DELETE_USERS,
		PERMISSIONS.VIEW_REPORTS,
		PERMISSIONS.EXPORT_REPORTS,
		PERMISSIONS.VIEW_LOGS,
		PERMISSIONS.SYSTEM_CONFIG,
		PERMISSIONS.MANAGE_ROLES,
	],
	[UserRole.ADMIN]: [
		PERMISSIONS.VIEW_DEVICES,
		PERMISSIONS.LOCATE_DEVICES,
		PERMISSIONS.MANAGE_DEVICES,
		PERMISSIONS.VIEW_USERS,
		PERMISSIONS.VIEW_REPORTS,
		PERMISSIONS.EXPORT_REPORTS,
		PERMISSIONS.VIEW_LOGS,
	],
	[UserRole.OPERATOR]: [PERMISSIONS.VIEW_DEVICES, PERMISSIONS.LOCATE_DEVICES],
	[UserRole.USER]: [PERMISSIONS.VIEW_DEVICES],
};

/**
 * Verifica si un rol tiene un permiso específico
 */
export function hasPermission(role: UserRole, permission: Permission | string): boolean {
	return ROLE_PERMISSIONS_MAP[role]?.includes(permission as Permission) ?? false;
}

/**
 * Obtiene todos los permisos de un rol
 */
export function getRolePermissions(role: UserRole): Permission[] {
	return ROLE_PERMISSIONS_MAP[role] ?? [];
}

/**
 * Verifica si un rol tiene múltiples permisos
 */
export function hasPermissions(role: UserRole, permissions: Permission[]): boolean {
	return permissions.every((permission) => hasPermission(role, permission));
}
