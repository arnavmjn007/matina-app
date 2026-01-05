import api from "./api";

// ---------- AUTH (public) ----------

export const createUser = async (userData, files = []) => {
  const formData = new FormData();

  // Send JSON as application/json (Spring handles this better)
  formData.append(
    "userData",
    new Blob([JSON.stringify(userData)], { type: "application/json" })
  );

  files.forEach((file) => {
    formData.append("files", file); // MUST match backend param name
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

// ---------- PUBLIC / GHOST MODE READS ----------
// NOTE: your backend paths must match these.
// If your backend uses /users/discover/{id} instead of /users/discovery, update here.

export const getDiscoveryUsers = async (userId) => {
  // OPTION A (your old client used this style)
  // const response = await api.get(`/users/discover/${userId}`);

  // OPTION B (if you implemented /api/users/discovery)
  const response = await api.get(`/users/discovery`, { params: { userId } });

  return response.data;
};

// If your ghost mode allows profiles view:
export const getUser = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

// ---------- AUTHENTICATED READS ----------

export const getLikedUsers = async (userId) => {
  const response = await api.get(`/users/liked/${userId}`);
  return response.data;
};

export const getMatches = async (userId) => {
  const response = await api.get(`/users/matches/${userId}`);
  return response.data;
};

// ---------- INTERACTIONS (authenticated) ----------

export const recordSwipe = async (swiperId, swipedId, action) => {
  const response = await api.post(`/interactions/swipe`, {
    swiperId,
    swipedId,
    action,
  });
  return response.data;
};

// ---------- USER UPDATES (authenticated) ----------

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

// ---------- CHAT (authenticated) ----------
// Your current version calls /messages/... using api baseURL, so this matches that.

export const getChatHistory = async (senderId, recipientId) => {
  const response = await api.get(`/messages/${senderId}/${recipientId}`);
  return response.data;
};
