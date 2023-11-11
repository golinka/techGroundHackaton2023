import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://16.171.65.177/api/v1',
    timeout: 80000
});

export default axiosClient;