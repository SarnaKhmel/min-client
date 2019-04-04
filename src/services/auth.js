import apiRequest from './api';

export const validateToken = async () => {
    return await apiRequest({path: "/auth"});
};

export const signIn = async ({email, password}) => {
    return await apiRequest({
        path: "/auth",
        method: "POST",
        data: {email, password}
    });
};

export const signUp = async ({name, email, password}) => {
    return await apiRequest({
        path: "/users",
        method: "POST",
        data: {name, email, password}
    });
};

export const signOut = async () => {
    await apiRequest({
        path: "/auth/sign_out",
        method: "DELETE"
    });
    return null;
};