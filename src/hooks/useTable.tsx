import { createContext, useContext } from 'react';
import type { Table } from '@tanstack/react-table';
import type { Device } from '@/types';

// Creamos un contexto para la tabla. Lo inicializamos como null.
const TableContext = createContext<Table<Device> | null>(null);

// Creamos el hook personalizado `useTable`.
export function useTable() {
	// `useContext` nos da el valor del contexto más cercano.
	const context = useContext(TableContext);
	if (!context) {
		// Si el hook se usa fuera del proveedor, lanzamos un error para avisar al desarrollador.
		throw new Error('useTable debe ser usado dentro de un TableProvider');
	}
	return context;
}

// Exportamos el Provider del contexto para usarlo en otros componentes.
export const TableProvider = TableContext.Provider;
