import api from './api';

export interface Internship {
    internship_id: string;
    company_id: string;
    title: string;
    internship_type: string;
    location: string;
    start_date?: string;
    end_date?: string;
    source: string;
    source_url: string;
    fetched_at: string;
    status: 'Unassigned' | 'Applied' | 'Interview' | 'Offer' | 'Rejected' | 'Ghosted';
    assigned_to?: string;
    last_contacted?: string;
    follow_up_date?: string;
    description?: string; // New field
    posted_at?: string;   // New field
    // Aggregated fields
    company_name?: string;
    company_industry?: string;
    company_website?: string;
    assignee_name?: string;
}

export interface ActivityLog {
    activity_id: string;
    user_id: string;
    internship_id: string;
    action_type: 'status_change' | 'note_added' | 'assigned' | 'ai_message_sent' | 'fetch_completed' | 'followup_created' | 'followup_updated';
    metadata?: any;
    created_at: string;
}

export interface Remark {
    remark_id: string;
    internship_id: string;
    user_id: string;
    note: string;
    created_at: string;
}

export interface FollowUp {
    followup_id: string;
    internship_id: string;
    user_id: string;
    due_date: string;
    notes?: string;
    reminder_sent: boolean;
    created_at: string;
}

export interface InternshipFilters {
    status?: string;
    internship_type?: string;
    location?: string;
    source?: string;
    assigned_user?: string;
    search?: string;
    page?: number;
    pageSize?: number;
    sort?: string; // e.g., 'fetched_at:desc'
}

export interface InternshipResponse {
    items: Internship[];
    page: number;
    pageSize: number;
    total: number;
}

export const getInternships = async (filters: InternshipFilters = {}): Promise<InternshipResponse> => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.internship_type) params.append('internship_type', filters.internship_type);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', String(filters.page));
    if (filters.pageSize) params.append('pageSize', String(filters.pageSize));
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.source) params.append('source', filters.source);
    if (filters.assigned_user) params.append('assigned_user', filters.assigned_user);

    const res = await api.get(`/internships?${params.toString()}`);
    return res.data;
};

export const updateInternshipStatus = async (id: string, status: string, remark?: string) => {
    const res = await api.patch(`/internships/${id}/status`, { new_status: status, remark });
    return res.data;
};

export const deleteInternship = async (id: string) => {
    const res = await api.delete(`/internships/${id}`);
    return res.data;
};

export const assignInternship = async (id: string, userId: string) => {
    const res = await api.patch(`/internships/${id}`, { assigned_to: userId });
    return res.data;
};

export const bulkAssignInternships = async (ids: string[], userId: string) => {
    const res = await api.post('/internships/bulk/assign', { ids, assigned_to: userId });
    return res.data;
};

export const bulkUpdateStatus = async (ids: string[], status: string, remark?: string) => {
    const res = await api.post('/internships/bulk/status', { ids, new_status: status, remark });
    return res.data;
};

export const getInternshipActivity = async (id: string) => {
    const res = await api.get(`/internships/${id}/activity`);
    return res.data;
};

export const getInternshipRemarks = async (id: string) => {
    const res = await api.get(`/internships/${id}/remarks`);
    return res.data;
};

export const addRemark = async (id: string, note: string) => {
    const res = await api.post(`/internships/${id}/remarks`, { note });
    return res.data;
};

export const getInternshipFollowUps = async (id: string) => {
    const res = await api.get(`/internships/${id}/followups`);
    return res.data;
};

export const createFollowUp = async (id: string, data: { due_date: string; notes?: string }) => {
    const res = await api.post(`/internships/${id}/followups`, data);
    return res.data;
};

export const updateFollowUp = async (followup_id: string, data: { due_date?: string; notes?: string }) => {
    const res = await api.patch(`/followups/${followup_id}`, data);
    return res.data;
};

export const completeFollowUp = async (followup_id: string) => {
    const res = await api.patch(`/followups/${followup_id}/complete`);
    return res.data;
};
