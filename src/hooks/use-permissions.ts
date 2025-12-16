'use client'

import { useUser } from '@/hooks/use-user';
import { UserRole, hasEqualOrHigherRole } from '@/lib/auth/roles';
import { hasPermission as checkPermission} from '@/lib/auth/permissions';

/**
 * Hook para verificar si el usuario tiene un permiso específico
 */
export function usePermission(permission: string): boolean {
	const user = useUser((state) => state.user);

	if (!user) return false;

	return checkPermission(user.role as UserRole, permission);
}

/**
 * Hook para verificar si el usuario tiene un rol específico o superior
 */
export function useHasRole(requiredRole: UserRole): boolean {
	const user = useUser((state) => state.user);

	if (!user) return false;

	return hasEqualOrHigherRole(user.role as UserRole, requiredRole);
}

/**
 * Hook para verificar múltiples permisos
 */
export function usePermissions(permissions: string[]): boolean[] {
	const user = useUser((state) => state.user);

	if (!user) return permissions.map(() => false);

	return permissions.map((permission) => checkPermission(user.role as UserRole, permission));
}

/**
 * Hook para verificar si tiene AL MENOS uno de los permisos
 */
export function useHasAnyPermission(permissions: string[]): boolean {
	const user = useUser((state) => state.user);

	if (!user) return false;

	return permissions.some((permission) => checkPermission(user.role as UserRole, permission));
}

/**
 * Hook para verificar si tiene TODOS los permisos
 */
export function useHasAllPermissions(permissions: string[]): boolean {
	const user = useUser((state) => state.user);

	if (!user) return false;

	return permissions.every((permission) => checkPermission(user.role as UserRole, permission));
}
