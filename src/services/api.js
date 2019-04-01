import axios from 'axios';

// Grabs the api url and local storage key from env variables
const API_URL = `${process.env.REACT_APP_API_URL}`;
const LOCAL_STORAGE_KEY = `${process.env.REACT_APP_STORAGE_KEY}`;

// Sets default headers to JSON
const DEFAULT_HEADERS = {
    "content-type": "application/json"
};

// Attaches auth headers to each axios request
axios.interceptors.request.use(config => {
    const {accessToken, clientToken, userToken} = 
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {};
    
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

// Takes the auth headers from each axios response and persists them to local storage
axios.interceptors.response.use(
    response => {
        const accessToken = response.headers["access-token"];
        const clientToken = response.headers["client"];
        const userToken = response.headers["uid"];

        if (accessToken) {
            localStorage.setItem(
                LOCAL_STORAGE_KEY,
                JSON.stringify({accessToken, clientToken, userToken})
            )
        }
        return response;
    },
    error => Promise.reject(error)
);

// Helper method for performing API requests
export const apiRequest = async({ path, method = "GET", data, headers = {} }) => {
    try {
        const response = await axios({
            url: API_URL + path,
            method,
            data: data || {},
            headers: Object.assign({}, DEFAULT_HEADERS, headers)
        });
        return response;
    }
    catch (error) {
        return error;
    }
}
