import axios from "axios";
const API_BASE = "http://localhost:3000/api/articles";

const articleApi = {
  getAll: () => axios.get(API_BASE),
  getById: (id) => axios.get(`${API_BASE}/${id}`),
};

export default articleApi;
