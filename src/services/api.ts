import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost/", // Replace with actual API URL from the exercise
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
