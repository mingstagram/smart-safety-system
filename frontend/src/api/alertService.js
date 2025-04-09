import axios from '../utils/axios';

export const getAlertsByUserId = async (userId) => {
    const response = await axios.get(`/api/alerts/user/${userId}`);
    return response.data;
};

export const getUnresolvedAlerts = async () => {
    const response = await axios.get('/api/alerts/unresolved');
    return response.data;
};

export const createAlert = async (alert) => {
    const response = await axios.post('/api/alerts', alert);
    return response.data;
};

export const resolveAlert = async (id) => {
    const response = await axios.put(`/api/alerts/${id}/resolve`);
    return response.data;
};

export const deleteAlert = async (id) => {
    await axios.delete(`/api/alerts/${id}`);
}; 