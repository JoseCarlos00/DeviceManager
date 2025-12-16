import { UserRole } from '@/lib/roles';

export interface User {
	id: string;
	username: string;
	role: UserRole;
}
