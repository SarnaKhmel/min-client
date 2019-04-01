import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}`;
const LOCAL_STORAGE_KEY = `${process.env.REACT_APP_STORAGE_KEY}`;

const DEFAULT_HEADERS = {
    "content-type": "application/json"
};

axios.interceptors.request.use(config => {
    const {accessToken, clientToken, userToken} = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {};
    
    Object.assign(config.headers.common, {
        "token-type": "Bearer",
        "access-token": accessToken,
        "client": clientToken,
        "uid": userToken
    });

    return config;
    },
    error => Promise.reject(error)
);



