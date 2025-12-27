import api from './api';

export interface Company {
    company_id: string;
    name: string;
    industry?: string;
    website?: string;
    size?: string;
    headquarters?: string;
    status: string; // Derived from internships
    assigned_to: string[]; // Aggregated from internships
}

export const getCompanies = async (filters: any = {}) => {
    const params = new URLSearchParams(filters);
    const res = await api.get(`/companies?${params.toString()}`);
    return res.data;
};

export const getCompany = async (id: string) => {
    const res = await api.get(`/companies/${id}`);
    return res.data;
};
