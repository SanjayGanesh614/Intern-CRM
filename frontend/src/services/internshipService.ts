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
}

export interface InternshipFilters {
    status?: string;
    internship_type?: string;
    location?: string;
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

    const res = await api.get(`/internships?${params.toString()}`);
    return res.data;
};

export const updateInternshipStatus = async (id: string, status: string) => {
    const res = await api.patch(`/internships/${id}/status`, { new_status: status });
    return res.data;
};

export const deleteInternship = async (id: string) => {
    const res = await api.delete(`/internships/${id}`);
    return res.data;
};
