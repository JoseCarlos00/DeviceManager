import { apiClient } from '@/lib/api';

export interface DeviceAlarmStat {
	device_id: string;
	total_alarms: number;
	first_alarm_time: number;
	last_alarm_time: number;
	average_per_day: number;
}

export interface DeviceLossReport {
	period: string;
	totalAlarms: number;
	devicesAffected: number;
	averageAlarmsPerDay: number;
	topDevices: DeviceAlarmStat[];
	allDevices: DeviceAlarmStat[];
}

export interface DeviceReportResponse {
	success: boolean;
	data: DeviceLossReport;
}

export interface CleanupResponse {
	success: boolean;
	message: string;
}

export const reportsApi = {
	getDevices: async (days: number = 30): Promise<DeviceLossReport> => {
		const res = await apiClient.get<DeviceReportResponse>(`/reports/devices?days=${days}`);
		return res.data.data;
	},

	cleanup: async (daysToKeep: number = 90): Promise<CleanupResponse> => {
		const res = await apiClient.post<CleanupResponse>('/reports/cleanup', { daysToKeep });
		return res.data;
	},
};
