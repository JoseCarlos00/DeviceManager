import { UserRole, getRoleBadgeColor, getRoleDisplayName } from '@/lib/roles';

interface RoleBadgeProps {
	role: UserRole;
	showIcon?: boolean;
	size?: 'sm' | 'md' | 'lg';
	className?: string;
}

const ROLE_ICONS = {
	[UserRole.SUPER_ADMIN]: '👑',
	[UserRole.ADMIN]: '⚡',
	[UserRole.OPERATOR]: '🔧',
	[UserRole.USER]: '👤',
} as const;

const SIZE_CLASSES = {
	sm: 'text-xs px-2 py-0.5',
	md: 'text-sm px-3 py-1',
	lg: 'text-base px-4 py-2',
};

export default function RoleBadge({ role, showIcon = true, size = 'md', className = '' }: RoleBadgeProps) {
	const colorClass = getRoleBadgeColor(role);
	const sizeClass = SIZE_CLASSES[size];
	const displayName = getRoleDisplayName(role);
	const icon = ROLE_ICONS[role];

	return (
		<span
			className={`inline-flex items-center gap-1 font-semibold rounded-full border ${colorClass} ${sizeClass} ${className}`}
		>
			{showIcon && <span>{icon}</span>}
			<span>{displayName}</span>
		</span>
	);
}
