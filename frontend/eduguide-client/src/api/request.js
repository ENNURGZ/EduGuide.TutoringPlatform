import api from './client';

export const getRequests = async () => {
    const response = await api.get('/Request');
    return response.data;
};

export const createRequest = async (data) => {
    const response = await api.post('/Request', data);
    return response.data;
};

export const updateRequestStatus = async (id, status) => {
    const response = await api.put(`/Request/${id}/status`, JSON.stringify(status), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

export const deleteRequest = async (id) => {
    const response = await api.delete(`/Request/${id}`);
    return response.data;
};
