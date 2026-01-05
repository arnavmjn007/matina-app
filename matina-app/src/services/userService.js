import api from "./api";

export const createUser = async (userData, files = []) => {
  const formData = new FormData();

  formData.append("userData", JSON.stringify(userData));

  files.forEach((file) => {
    formData.append("files", file); 
  });

  const response = await api.post("/users/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await api.post("/users/login", { email, password });
  return response.data;
};

export const getDiscoveryUsers = async (userId) => {
  const url = userId ? `/users/discover/${userId}` : `/users/discover`;
  const response = await api.get(url);
  return response.data;
};

export const getUser = async (userId) => {
  const response = await api.get(`/users/${userId}`);
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
  const response = await api.post(`/interactions/swipe`, {
    swiperId,
    swipedId,
    action,
  });
  return response.data;
};


export const updateUser = async (userId, userData) => {
  const response = await api.put(`/users/${userId}`, userData, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

export const updatePassword = async (userId, newPassword) => {
  const response = await api.put(`/users/password/${userId}`, { newPassword });
  return response.data;
};

export const updateUserWithImage = async (userId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.put(`/users/profile-image/${userId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
};


export const getChatHistory = async (senderId, recipientId) => {
  const response = await api.get(`/messages/${senderId}/${recipientId}`);
  return response.data;
};
