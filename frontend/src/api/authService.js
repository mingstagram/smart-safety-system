import axios from '../utils/axios';

export const login = async (credentials) => {
    const response = await axios.post('/api/auth/login', credentials);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

export const register = async (userData) => {
    const response = await axios.post('/api/users', userData);
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
};

export const getCurrentUser = async () => {
    const response = await axios.get('/api/users/me');
    return response.data;
}; 