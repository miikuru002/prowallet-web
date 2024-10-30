import axios from 'axios';

const httpClient = axios.create({
  baseURL: 'https://prowallet.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default httpClient;