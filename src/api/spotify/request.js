import axios from 'axios';

const request = axios.create({
  baseURL: 'http://localhost:4000',
});

export default request;