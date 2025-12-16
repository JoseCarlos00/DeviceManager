'use client'

// ============================================
// Componente para proteger contenido por rol

import { useHasRole } from '@/hooks/use-permissions';
import { UserRole } from '@/lib/auth/roles';

interface ProtectedContentProps {
	requiredRole: UserRole;
	children: React.ReactNode;
	fallback?: React.ReactNode;
}

export function ProtectedContent({ requiredRole, children, fallback = null }: ProtectedContentProps) {
	const hasRole = useHasRole(requiredRole);

	if (!hasRole) {
		return <>{fallback}</>;
	}

	return <>{children}</>;
}
