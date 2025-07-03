import axiosClient from "./axiosClient";

const API_BASE = "http://localhost:3000/api/tours";

const tourApi = {
  getAll: () => axiosClient.get(API_BASE),
  getById: (id) => axiosClient.get(`${API_BASE}/${id}`),
  getUserTours: (userId) => axiosClient.get(`${API_BASE}/user/${userId}`),
  cloneTour: (tourId, userId) => axiosClient.post(`${API_BASE}/${tourId}/clone`, { user_id: userId }),
};

export default tourApi;
