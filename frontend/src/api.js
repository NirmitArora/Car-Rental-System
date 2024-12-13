import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Change to your backend server port if needed

export const registerUser = (userData) => {
    return axios.post(`${API_URL}/register`, userData);
};

export const loginUser = (loginData) => {
    return axios.post(`${API_URL}/login`, loginData);
};

export const getCars = () => {
    return axios.get(`${API_URL}/cars`);
};

export const getCarById = (id) => {
    return axios.get(`${API_URL}/cars/${id}`);
};

export const updateCar = (id, carData) => {
    return axios.put(`${API_URL}/cars/${id}`, carData);
};

export const makeReservation = (reservationData) => {
    return axios.post(`${API_URL}/reservations`, reservationData);
};

export const uploadCarMedia = (id, formData) => {
    return axios.post(`${API_URL}/cars/${id}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const updateUserProfile = (userData) => {
    return axios.put(`${API_URL}/profile`, userData);
};
