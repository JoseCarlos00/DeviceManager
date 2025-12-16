'use client'

// ============================================
// Componente para proteger contenido por permiso
// ============================================

import { usePermission } from "@/hooks/use-permissions"

interface ProtectedByPermissionProps {
	permission: string;
	children: React.ReactNode;
	fallback?: React.ReactNode;
}

export function ProtectedByPermission({ permission, children, fallback = null }: ProtectedByPermissionProps) {
	const hasPermission = usePermission(permission);

	if (!hasPermission) {
		return <>{fallback}</>;
	}

	return <>{children}</>;
}
