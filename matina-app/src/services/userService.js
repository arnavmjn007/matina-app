import axios from 'axios';

// The base URL for your user-related API endpoints
const API_URL = 'http://localhost:8080/api/users';
// The base URL for your interaction-related API endpoints
const INTERACTIONS_API_URL = 'http://localhost:8080/api/interactions';

/**
 * Registers a new user.
 * @param {object} userData - The complete user data object.
 * @param {File} file - The user's profile image file.
 * @returns {Promise<object>} The newly created user object.
 */
export const createUser = async (userData, file) => {
    const formData = new FormData();
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
 * Logs in an existing user.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<object>} The logged-in user's data.
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

/**
 * Fetches a list of potential matches for the discovery page.
 * @param {number} userId - The ID of the currently logged-in user.
 * @returns {Promise<Array>} A list of user objects.
 */
export const getDiscoveryUsers = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/discover/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching discovery users:", error);
        throw error;
    }
};

/**
 * Fetches a list of users who have liked the current user.
 * @param {number} userId - The ID of the currently logged-in user.
 * @returns {Promise<Array>} A list of user objects.
 */
export const getLikedUsers = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/liked/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching liked users:", error);
        throw error;
    }
};

/**
 * Fetches a list of mutual matches for the current user.
 * @param {number} userId - The ID of the currently logged-in user.
 * @returns {Promise<Array>} A list of user objects.
 */
export const getMatches = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/matches/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching matches:", error);
        throw error;
    }
};

/**
 * Records a swipe action (like/dislike) in the database.
 * @param {number} swiperId - The ID of the user performing the action.
 * @param {number} swipedId - The ID of the user being swiped on.
 * @param {string} action - The action, either 'like' or 'dislike'.
 * @returns {Promise<object>} An object indicating if a match occurred, e.g., { isMatch: true }.
 */
export const recordSwipe = async (swiperId, swipedId, action) => {
    try {
        const response = await axios.post(`${INTERACTIONS_API_URL}/swipe`, { swiperId, swipedId, action });
        return response.data;
    } catch (error) {
        console.error("Error recording swipe:", error);
        throw error;
    }
};

/**
 * Updates a user's profile information.
 * @param {number} userId - The ID of the user to update.
 * @param {object} userData - The full user data object with the updated information.
 * @returns {Promise<object>} The updated user object from the server.
 */
export const updateUser = async (userId, userData) => {
    try {
        const response = await axios.put(`${API_URL}/${userId}`, userData);
        return response.data;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};