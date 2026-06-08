import { create } from 'zustand';
import { URL_VERSION_APP } from '@/lib/constants'

interface AppVersionStore {
	currentVersion: number | null;
	currentVersionName: string | null;
	fetchVersion: () => Promise<void>;
}

export const useAppVersionStore = create<AppVersionStore>((set) => ({
	currentVersion: null,
	currentVersionName: null,

	fetchVersion: async () => {
		try {
			const response = await fetch(URL_VERSION_APP, {
				method: 'GET',
				headers: {
					Accept: 'application/json',
				},
			});

			if (response.ok) {
				const json = await response.json();
				const versionCode = Number(json.versionCode);
				const versionName = json.versionName;

				set({
					currentVersion: versionCode,
					currentVersionName: versionName,
				});
			}
		} catch {
			// currentVersion queda null, columna muestra versión sin ícono
		}

		
	},
}));
