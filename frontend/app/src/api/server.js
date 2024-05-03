import axios from "axios";

const baseURL =  import.meta.env.VITE_BASE_API_URL;

const server = axios.create({
  baseURL,
});

export default server;