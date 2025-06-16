import axios from "axios";

const API_BASE = "http://localhost:3000/api";

const userApi = {
  getAll: () => axios.get(`${API_BASE}/users`),
};

export default userApi;
