import api from './client';

export const getListings = async (params) => {
    const response = await api.get('/Listing', { params });
    return response.data;
};

export const getListingById = async (id) => {
    const response = await api.get(`/Listing/${id}`);
    return response.data;
};

export const createListing = async (data) => {
    const response = await api.post('/Listing', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const updateListing = async (id, data) => {
    const response = await api.put(`/Listing/${id}`, data);
    return response.data;
};

export const deleteListing = async (id) => {
    const response = await api.delete(`/Listing/${id}`);
    return response.data;
};
