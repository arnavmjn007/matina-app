import axios from 'axios';
import api from './api';

const API_URL = 'http://localhost:8080/api/users';
const INTERACTIONS_API_URL = 'http://localhost:8080/api/interactions';

// --- Authentication (No Token Needed) ---

// UPDATED: This function now accepts a list of files
export const createUser = async (userData, files) => {
    const formData = new FormData();
    formData.append('userData', JSON.stringify(userData));

    files.forEach(file => {
        formData.append('files', file); // Append each file to the 'files' key
    });

    try {
        const response = await axios.post(`${API_URL}/register`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        return response.data;
    } catch (error) {
        console.error("Error during login:", error);
        throw error;
    }
};

// --- Authenticated Requests ---

export const getDiscoveryUsers = async (userId) => {
    const response = await api.get(`/users/discover/${userId}`);
    return response.data;
};

export const getLikedUsers = async (userId) => {
    const response = await api.get(`/users/liked/${userId}`);
    return response.data;
};

export const getMatches = async (userId) => {
    const response = await api.get(`/users/matches/${userId}`);
    return response.data;
};

export const recordSwipe = async (swiperId, swipedId, action) => {
    const response = await api.post(`${INTERACTIONS_API_URL}/swipe`, { swiperId, swipedId, action });
    return response.data;
};

export const updateUser = async (userId, userData) => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
};

export const deleteUser = async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
};

export const updatePassword = async (userId, newPassword) => {
    const response = await api.put(`/users/password/${userId}`, { newPassword });
    return response.data;
};