import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					'react-vendor': ['react', 'react-dom', 'react-router-dom'],
					'ui-vendor': [
						'@radix-ui/react-alert-dialog',
						'@radix-ui/react-dialog',
						'@radix-ui/react-dropdown-menu',
						'@radix-ui/react-label',
						'@radix-ui/react-select',
						'@radix-ui/react-slot',
						'@radix-ui/react-tooltip',
					],
					'table-vendor': ['@tanstack/react-table'],
					'socket-vendor': ['socket.io-client'],
					'utils-vendor': ['axios', 'zustand', 'sonner', 'lucide-react'],
				},
			},
		},
	},
	server: {
		proxy: {
			'/api': {
				target: 'http://192.168.15.241:9001',
				changeOrigin: true,
				secure: false,
			},
			'/socket.io': {
				target: 'ws://192.168.15.241:9001',
				ws: true,
			},
		},
	},
});
