import { useHasRole } from '@/hooks/usePermissions';
import { UserRole } from '@/lib/roles'; // ← tu proyecto usa @/lib/roles, no @/lib/auth/roles

interface ProtectedContentProps {
	requiredRole: UserRole;
	children: React.ReactNode;
	fallback?: React.ReactNode;
}

export function ProtectedContent({ requiredRole, children, fallback = null }: ProtectedContentProps) {
	const hasRole = useHasRole(requiredRole);
	if (!hasRole) return <>{fallback}</>;
	return <>{children}</>;
}
