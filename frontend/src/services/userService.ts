import api from './api';

export interface User {
    user_id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
    created_at?: string;
    last_login?: string;
}

// Create new user (admin only)
export const createUser = async (userData: any): Promise<User> => {
    const res = await api.post('/users', userData);
    return res.data;
};

export const getAllUsers = async (): Promise<User[]> => {
    const res = await api.get('/users');
    return res.data;
};

export const updateUserRole = async (userId: string, role: 'admin' | 'user'): Promise<User> => {
    const res = await api.patch(`/users/${userId}/role`, { role });
    return res.data;
};

export const deleteUser = async (userId: string): Promise<void> => {
    await api.delete(`/users/${userId}`);
};
