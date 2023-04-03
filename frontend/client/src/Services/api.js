// make a call to api that can be modular
// and can be used in any component

import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
});

export default api;


