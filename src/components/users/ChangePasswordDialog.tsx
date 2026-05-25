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
import type { UserDTO, UpdatePasswordPayload } from '@/lib/api/users';

interface ChangePasswordDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	user: UserDTO | null;
	onSubmit: (id: number, data: UpdatePasswordPayload) => Promise<void>;
}

export default function ChangePasswordDialog({
	open,
	onOpenChange,
	user,
	onSubmit,
}: ChangePasswordDialogProps) {
	const [oldPassword, setOldPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (open) {
			setOldPassword('');
			setNewPassword('');
			setConfirmPassword('');
			setError(null);
		}
	}, [open]);

	const handleSubmit = async () => {
		setError(null);

		if (!oldPassword || !newPassword || !confirmPassword) {
			setError('Todos los campos son requeridos.');
			return;
		}
		if (newPassword !== confirmPassword) {
			setError('Las contraseñas nuevas no coinciden.');
			return;
		}
		if (newPassword.length < 6) {
			setError('La contraseña debe tener al menos 6 caracteres.');
			return;
		}
		if (!user) return;

		setIsSubmitting(true);
		try {
			await onSubmit(user.id, { oldPassword, newPassword });
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
					<DialogTitle>
						Cambiar contraseña — <span className='text-muted-foreground font-normal'>{user?.username}</span>
					</DialogTitle>
				</DialogHeader>

				<div className='space-y-4 py-2'>
					<div className='space-y-2'>
						<Label htmlFor='cp-old'>Contraseña actual</Label>
						<Input
							id='cp-old'
							type='password'
							placeholder='********'
							value={oldPassword}
							onChange={(e) => setOldPassword(e.target.value)}
							disabled={isSubmitting}
							autoComplete='current-password'
						/>
					</div>
					<div className='space-y-2'>
						<Label htmlFor='cp-new'>Nueva contraseña</Label>
						<Input
							id='cp-new'
							type='password'
							placeholder='********'
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							disabled={isSubmitting}
							autoComplete='new-password'
						/>
					</div>
					<div className='space-y-2'>
						<Label htmlFor='cp-confirm'>Confirmar nueva contraseña</Label>
						<Input
							id='cp-confirm'
							type='password'
							placeholder='********'
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							disabled={isSubmitting}
							autoComplete='new-password'
						/>
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
						{isSubmitting ? 'Guardando...' : 'Cambiar contraseña'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
