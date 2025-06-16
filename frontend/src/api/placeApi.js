import axios from "axios";
const API_BASE = "http://localhost:3000/api/places";

const placeApi = {
  getAll: () => axios.get(API_BASE),
  getById: (id) => axios.get(`${API_BASE}/${id}`),
};

export default placeApi;
