import axios from "axios";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/+$/, "") ||
  "http://127.0.0.1:5002";

const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  // Flask butuh waktu load model saat startup/reload (debug mode)
  timeout: 30000,
});

export default axiosInstance;
