import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { UserDTO } from '@/lib/api/users';

interface DeleteUserDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	user: UserDTO | null;
	onConfirm: (id: number) => Promise<void>;
	isDeleting: boolean;
}

export default function DeleteUserDialog({
	open,
	onOpenChange,
	user,
	onConfirm,
	isDeleting,
}: DeleteUserDialogProps) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
					<AlertDialogDescription>
						Estás a punto de eliminar al usuario{' '}
						<span className='font-semibold text-foreground'>{user?.username}</span>. Esta acción no se
						puede deshacer.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isDeleting} className='cursor-pointer'>
						Cancelar
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={(e) => {
							e.preventDefault();
							if (user) onConfirm(user.id);
						}}
						disabled={isDeleting}
						className='bg-destructive hover:bg-destructive/90 cursor-pointer'
					>
						{isDeleting ? 'Eliminando...' : 'Eliminar'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
