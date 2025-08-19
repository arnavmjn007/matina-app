import axios from 'axios';

// The URL is now pointing to your Java Spring Boot application
const API_URL = 'http://localhost:8080/api/users';

export const getAllUsers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with id ${id}:`, error);
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user with id ${id}:`, error);
    throw error;
  }
};

// New function to handle user creation with image upload
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


export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password
    });
    return response.data; // This will be the user object on success
  } catch (error) {
    console.error("Error during login:", error);
    throw error; // Re-throw the error to be handled by the component
  }
};

