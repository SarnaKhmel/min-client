import React, {useState, useEffect} from 'react';
import apiRequest from "../../services/api";

export const AuthContext = React.createContext();
export const LOCAL_STORAGE_KEY = `${process.env.REACT_APP_STORAGE_KEY}`;

const Auth = ({children}) => {
    const [initialLoading, setInitialLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [authToken, setAuthToken] = useState(null);

    const setCurrentAuthToken = async (newAuthToken) => {
        setAuthToken(newAuthToken);

        if (!newAuthToken) {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
    }

    const authenticate = async () => {
        const jwtToken = localStorage.getItem(LOCAL_STORAGE_KEY);

        try {
            const response = await apiRequest({path: "/users/me"});
            
            if (response.data._id) {
                await setUser(response.data);
                await setCurrentAuthToken(jwtToken);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setInitialLoading(false);
        }
    };

    useEffect(() => {
        authenticate();
    }, []);

    if (initialLoading) {
        return <h4>Loading...</h4>;
    }

    const context = {user, setUser, authToken, setCurrentAuthToken};
    return (
        <AuthContext.Provider value={context}>
            {children(context.authToken)}
        </AuthContext.Provider>
    )
};

export default Auth;