import api from './client';

export const getCategories = async () => {
    const response = await api.get('/Category');
    return response.data;
};

export const createCategory = async (data) => {
    const response = await api.post('/Category', data);
    return response.data;
};

export const updateCategory = async (id, data) => {
    const response = await api.put(`/Category/${id}`, data);
    return response.data;
};

export const deleteCategory = async (id) => {
    const response = await api.delete(`/Category/${id}`);
    return response.data;
};
