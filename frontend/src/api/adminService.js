import axios from '../utils/axios';

export const getAdmins = async () => {
    try {
        const response = await axios.get('/api/admins');
        console.log('API Response:', response); // 디버깅을 위한 로그 추가
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const getAdmin = async (id) => {
    const response = await axios.get(`/api/admins/${id}`);
    return response.data;
};

export const createAdmin = async (adminData) => {
    try {
        const response = await axios.post('/api/admins', adminData);
        console.log('Create Admin Response:', response); // 디버깅을 위한 로그 추가
        return response.data;
    } catch (error) {
        console.error('Create Admin Error:', error);
        throw error;
    }
};

export const updateAdmin = async (id, adminData) => {
    const response = await axios.put(`/api/admins/${id}`, adminData);
    return response.data;
};

export const deleteAdmin = async (id) => {
    const response = await axios.delete(`/api/admins/${id}`);
    return response.data;
}; 