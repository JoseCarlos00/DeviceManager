import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	server: {
		proxy: {
			'/api': {
				target: 'http://192.168.1.8:9001',
				changeOrigin: true,
				secure: false,
			},
			'/socket.io': {
				target: 'ws://192.168.1.8:9001',
				ws: true,
			},
		},
	},
});
