import axios from '../utils/axios';

export const getHealthDataByUserId = async (userId) => {
    const response = await axios.get(`/api/health-data/user/${userId}`);
    return response.data;
};

export const getHealthDataByDateRange = async (userId, start, end) => {
    const response = await axios.get(`/api/health-data/user/${userId}/date-range`, {
        params: { start, end }
    });
    return response.data;
};

export const createHealthData = async (healthData) => {
    const response = await axios.post('/api/health-data', healthData);
    return response.data;
};

export const deleteHealthData = async (id) => {
    await axios.delete(`/api/health-data/${id}`);
}; 