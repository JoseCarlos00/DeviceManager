import { useState, useEffect } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { UserRole } from '@/lib/roles';
import type { UserDTO, CreateUserPayload, UpdateUserPayload } from '@/lib/api/users';

const ROLES: UserRole[] = [
	UserRole.SUPER_ADMIN,
	UserRole.ADMIN,
	UserRole.OPERATOR,
	UserRole.USER,
];

const ROLE_LABELS: Record<UserRole, string> = {
	[UserRole.SUPER_ADMIN]: 'Super Administrador',
	[UserRole.ADMIN]: 'Administrador',
	[UserRole.OPERATOR]: 'Operador',
	[UserRole.USER]: 'Usuario',
};

interface UserFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	user?: UserDTO | null; // null = create mode
	onSubmit: (data: CreateUserPayload | UpdateUserPayload) => Promise<void>;
}

export default function UserFormDialog({
	open,
	onOpenChange,
	user,
	onSubmit,
}: UserFormDialogProps) {
	const isEdit = !!user;

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [role, setRole] = useState<UserRole>(UserRole.USER);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Sync form when user changes (edit mode)
	useEffect(() => {
		if (open) {
			setUsername(user?.username ?? '');
			setRole(user?.role ?? UserRole.USER);
			setPassword('');
			setError(null);
		}
	}, [open, user]);

	const handleSubmit = async () => {
		setError(null);

		if (!username.trim()) {
			setError('El nombre de usuario es requerido.');
			return;
		}
		if (!isEdit && !password.trim()) {
			setError('La contraseña es requerida.');
			return;
		}

		setIsSubmitting(true);
		try {
			if (isEdit) {
				const payload: UpdateUserPayload = {};
				if (username !== user?.username) payload.username = username.trim();
				if (role !== user?.role) payload.role = role;

				if (Object.keys(payload).length === 0) {
					onOpenChange(false);
					return;
				}
				await onSubmit(payload);
			} else {
				await onSubmit({ username: username.trim(), password: password.trim(), role });
			}
			onOpenChange(false);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle>{isEdit ? 'Editar usuario' : 'Crear nuevo usuario'}</DialogTitle>
				</DialogHeader>

				<div className='space-y-4 py-2'>
					<div className='space-y-2'>
						<Label htmlFor='uf-username'>Nombre de usuario</Label>
						<Input
							id='uf-username'
							placeholder='usuario'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							disabled={isSubmitting}
							autoComplete='off'
						/>
					</div>

					{!isEdit && (
						<div className='space-y-2'>
							<Label htmlFor='uf-password'>Contraseña</Label>
							<Input
								id='uf-password'
								type='password'
								placeholder='********'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								disabled={isSubmitting}
								autoComplete='new-password'
							/>
						</div>
					)}

					<div className='space-y-2'>
						<Label>Rol</Label>
						<Select
							value={role}
							onValueChange={(v) => setRole(v as UserRole)}
							disabled={isSubmitting}
						>
							<SelectTrigger className='w-full'>
								<SelectValue placeholder='Selecciona un rol' />
							</SelectTrigger>
							<SelectContent>
								{ROLES.map((r) => (
									<SelectItem key={r} value={r}>
										{ROLE_LABELS[r]}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{error && <p className='text-sm text-destructive'>{error}</p>}
				</div>

				<DialogFooter>
					<Button
						variant='outline'
						onClick={() => onOpenChange(false)}
						disabled={isSubmitting}
						className='cursor-pointer'
					>
						Cancelar
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={isSubmitting}
						className='cursor-pointer'
					>
						{isSubmitting
							? isEdit ? 'Guardando...' : 'Creando...'
							: isEdit ? 'Guardar cambios' : 'Crear usuario'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
