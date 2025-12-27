import api from './api';

export interface DashboardStats {
    total_internships: number;
    total_companies: number;
    internships_by_status: Record<string, number>;
    followups_due_today: number;
}

export interface TimelineData {
    _id: string; // Date string YYYY-MM-DD
    count: number;
}

export const getAnalyticsDashboard = async (): Promise<DashboardStats> => {
    const res = await api.get('/analytics/dashboard');
    return res.data;
};

export const getTimeline = async (): Promise<TimelineData[]> => {
    const res = await api.get('/analytics/timeline');
    return res.data;
};
