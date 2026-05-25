import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { UserPlus, Pencil, Trash2, KeyRound, RefreshCw, Users } from 'lucide-react';
import RoleBadge from '@/components/RoleBadge';
import { UserRole } from '@/lib/roles';
import { usersApi, type UserDTO, type CreateUserPayload, type UpdateUserPayload, type UpdatePasswordPayload } from '@/lib/api/users';
import { useAuthStore } from '@/stores/authStore';
import UserFormDialog from '@/components/users/UserFormDialog';
import ChangePasswordDialog from '@/components/users/ChangePasswordDialog';
import DeleteUserDialog from '@/components/users/DeleteUserDialog';

// Extract server error message
const getApiError = (error: unknown, fallback: string): string => {
	if (isAxiosError(error)) {
		return error.response?.data?.message ?? fallback;
	}
	return fallback;
};

export default function UsersPage() {
	const currentUser = useAuthStore((state) => state.user);

	const [users, setUsers] = useState<UserDTO[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// Dialog states
	const [formDialogOpen, setFormDialogOpen] = useState(false);
	const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	// ── Fetch ──────────────────────────────────────────────────────────────
	const fetchUsers = useCallback(async () => {
		setIsLoading(true);
		try {
			const data = await usersApi.getAll();
			setUsers(data);
		} catch (error) {
			toast.error('Error al cargar usuarios', {
				description: getApiError(error, 'No se pudo obtener la lista de usuarios.'),
			});
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	// ── Handlers ───────────────────────────────────────────────────────────
	const openCreate = () => {
		setSelectedUser(null);
		setFormDialogOpen(true);
	};

	const openEdit = (user: UserDTO) => {
		setSelectedUser(user);
		setFormDialogOpen(true);
	};

	const openChangePassword = (user: UserDTO) => {
		setSelectedUser(user);
		setPasswordDialogOpen(true);
	};

	const openDelete = (user: UserDTO) => {
		setSelectedUser(user);
		setDeleteDialogOpen(true);
	};

	const handleFormSubmit = async (data: CreateUserPayload | UpdateUserPayload) => {
		if (selectedUser) {
			// Edit
			await usersApi.update(selectedUser.id, data as UpdateUserPayload).catch((err) => {
				throw new Error(getApiError(err, 'Error al actualizar el usuario.'));
			});
			toast.success('Usuario actualizado con éxito');
		} else {
			// Create
			await usersApi.create(data as CreateUserPayload).catch((err) => {
				throw new Error(getApiError(err, 'Error al crear el usuario.'));
			});
			toast.success('Usuario creado con éxito');
		}
		await fetchUsers();
	};

	const handlePasswordSubmit = async (id: number, data: UpdatePasswordPayload) => {
		await usersApi.updatePassword(id, data).catch((err) => {
			throw new Error(getApiError(err, 'Error al cambiar la contraseña.'));
		});
		toast.success('Contraseña actualizada con éxito');
	};

	const handleDelete = async (id: number) => {
		setIsDeleting(true);
		try {
			await usersApi.delete(id);
			toast.success('Usuario eliminado con éxito');
			setDeleteDialogOpen(false);
			await fetchUsers();
		} catch (error) {
			toast.error('Error al eliminar el usuario', {
				description: getApiError(error, 'No se pudo eliminar el usuario.'),
			});
		} finally {
			setIsDeleting(false);
		}
	};

	// ── Render ─────────────────────────────────────────────────────────────
	return (
		<div className='space-y-6 pt-2'>
			<Card>
				<CardHeader>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-2'>
							<Users className='h-5 w-5' />
							<CardTitle>Gestión de Usuarios</CardTitle>
						</div>
						<div className='flex items-center gap-2'>
							<Button
								variant='outline'
								size='sm'
								onClick={fetchUsers}
								disabled={isLoading}
								className='cursor-pointer'
							>
								<RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
								<span className='ml-2 hidden sm:inline'>
									{isLoading ? 'Cargando...' : 'Refrescar'}
								</span>
							</Button>
							<Button size='sm' onClick={openCreate} className='cursor-pointer'>
								<UserPlus className='h-4 w-4' />
								<span className='ml-2 hidden sm:inline'>Nuevo usuario</span>
							</Button>
						</div>
					</div>
					<CardDescription>
						Administra las cuentas de acceso al panel de control
					</CardDescription>
				</CardHeader>

				<CardContent>
					{isLoading && users.length === 0 ? (
						<div className='flex items-center justify-center py-12'>
							<RefreshCw className='h-6 w-6 animate-spin text-muted-foreground' />
						</div>
					) : users.length === 0 ? (
						<p className='text-center text-sm text-muted-foreground py-12'>
							No hay usuarios registrados.
						</p>
					) : (
						<div className='rounded-md border'>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>ID</TableHead>
										<TableHead>Usuario</TableHead>
										<TableHead>Rol</TableHead>
										<TableHead>Estado</TableHead>
										<TableHead className='text-right'>Acciones</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{users.map((user) => {
										const isSelf = user.id === Number(currentUser?.id);
										return (
											<TableRow key={user.id}>
												<TableCell className='font-mono text-xs text-muted-foreground'>
													#{user.id}
												</TableCell>
												<TableCell className='font-medium'>
													{user.username}
													{isSelf && (
														<Badge variant='outline' className='ml-2 text-xs'>
															Tú
														</Badge>
													)}
												</TableCell>
												<TableCell>
													<RoleBadge role={user.role as UserRole} size='sm' />
												</TableCell>
												<TableCell>
													<Badge variant='secondary' className='text-xs'>
														Activo
													</Badge>
												</TableCell>
												<TableCell className='text-right'>
													<div className='flex justify-end gap-1'>
														<Button
															variant='ghost'
															size='icon-sm'
															onClick={() => openEdit(user)}
															className='cursor-pointer'
															title='Editar usuario'
														>
															<Pencil className='h-3.5 w-3.5' />
														</Button>
														<Button
															variant='ghost'
															size='icon-sm'
															onClick={() => openChangePassword(user)}
															className='cursor-pointer'
															title='Cambiar contraseña'
														>
															<KeyRound className='h-3.5 w-3.5' />
														</Button>
														<Button
															variant='ghost'
															size='icon-sm'
															onClick={() => openDelete(user)}
															disabled={isSelf}
															className='cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10'
															title={isSelf ? 'No puedes eliminarte a ti mismo' : 'Eliminar usuario'}
														>
															<Trash2 className='h-3.5 w-3.5' />
														</Button>
													</div>
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Dialogs */}
			<UserFormDialog
				open={formDialogOpen}
				onOpenChange={setFormDialogOpen}
				user={selectedUser}
				onSubmit={handleFormSubmit}
			/>

			<ChangePasswordDialog
				open={passwordDialogOpen}
				onOpenChange={setPasswordDialogOpen}
				user={selectedUser}
				onSubmit={handlePasswordSubmit}
			/>

			<DeleteUserDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				user={selectedUser}
				onConfirm={handleDelete}
				isDeleting={isDeleting}
			/>
		</div>
	);
}
