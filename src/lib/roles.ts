/**
 * Tipos de roles disponibles en el sistema
 */
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
  USER = 'USER',
}

/**
 * Jerarquía de roles (de mayor a menor privilegio)
 */
export const ROLE_HIERARCHY: UserRole[] = [
  UserRole.SUPER_ADMIN,
  UserRole.ADMIN,
  UserRole.OPERATOR,
  UserRole.USER,
];

/**
 * Descripciones de cada rol
 */
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: 'Acceso completo al sistema, incluida gestión de usuarios y configuración',
  [UserRole.ADMIN]: 'Acceso administrativo, puede gestionar dispositivos y ver reportes',
  [UserRole.OPERATOR]: 'Puede localizar dispositivos y ver información básica',
  [UserRole.USER]: 'Acceso de solo lectura al dashboard',
};


/**
 * Verifica si un rol tiene mayor o igual jerarquía que otro
 */
export function hasEqualOrHigherRole(userRole: UserRole, requiredRole: UserRole): boolean {
  const userRoleIndex = ROLE_HIERARCHY.indexOf(userRole);
  const requiredRoleIndex = ROLE_HIERARCHY.indexOf(requiredRole);
  
  return userRoleIndex <= requiredRoleIndex;
}

/**
 * Obtiene el color badge para cada rol (para UI)
 */
export function getRoleBadgeColor(role: UserRole): string {
  switch (role) {
    case UserRole.SUPER_ADMIN:
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case UserRole.ADMIN:
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case UserRole.OPERATOR:
      return 'bg-green-100 text-green-800 border-green-200';
    case UserRole.USER:
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

/**
 * Obtiene el nombre legible del rol
 */
export function getRoleDisplayName(role: UserRole): string {
  switch (role) {
    case UserRole.SUPER_ADMIN:
      return 'Super Administrador';
    case UserRole.ADMIN:
      return 'Administrador';
    case UserRole.OPERATOR:
      return 'Operador';
    case UserRole.USER:
      return 'Usuario';
    default:
      return 'Desconocido';
  }
}
