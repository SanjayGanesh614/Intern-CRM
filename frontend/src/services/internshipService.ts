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
