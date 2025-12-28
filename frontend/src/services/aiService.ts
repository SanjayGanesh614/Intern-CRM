import api from './api';

export interface OutreachRequest {
    company_name: string;
    internship_title: string;
    internship_description?: string;
    type: 'email' | 'linkedin';
    user_notes?: string;
}

export interface OutreachResponse {
    status: string;
    generated_content?: string;
    message?: string;
}

export const generateOutreach = async (data: OutreachRequest): Promise<OutreachResponse> => {
    const res = await api.post('/ai/outreach/generate', data);
    return res.data;
};
