import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users';

/**
 * Handles new user registration with profile image.
 * @param {object} userData - The user data object.
 * @param {File} file - The image file to upload.
 * @returns {Promise<object>} The created user data.
 */
export const createUser = async (userData, file) => {
    const formData = new FormData();
    // The names 'userData' and 'file' must match the @RequestParam names in your Java controller
    formData.append('userData', JSON.stringify(userData));
    formData.append('file', file);

    try {
        const response = await axios.post(`${API_URL}/register`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

/**
 * Handles user login.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<object>} The logged-in user data.
 */
export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        return response.data;
    } catch (error) {
        console.error("Error during login:", error);
        throw error;
    }
};