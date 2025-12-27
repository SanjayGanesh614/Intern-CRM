import api from './api';

export interface FetchParams {
    mode?: 'default' | 'fast' | 'deep';
    threshold?: number;
    internship_types?: string[];
    locations?: string[];
    sources?: string[];
}

export interface FetchProgressData {
    phase: 'idle' | 'python_fetch' | 'python_process' | 'db_upsert' | 'done' | 'failed' | 'cancelled';
    percent: number;
    total_fetched: number;
    valid_entries: number;
    duplicates: number;
    message?: string;
}

export const runFetch = async (params: FetchParams) => {
    const res = await api.post('/fetch/run', params);
    return res.data; // expects { fetch_id: string }
};

export const getFetchStatus = async (fetchId: string): Promise<FetchProgressData> => {
    const res = await api.get(`/fetch/status/${fetchId}`);
    return res.data;
};

export const cancelFetch = async (fetchId: string) => {
    const res = await api.post(`/fetch/cancel/${fetchId}`);
    return res.data;
};
