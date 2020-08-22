import axios from "axios";

const request = axios.create({
  baseURL: '/api/auth',
});

export default request;