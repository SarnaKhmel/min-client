import apiRequest from './api';

export const postTimer = async ({
        userId, 
        name, 
        isPomodoro, 
        currentTime, 
        intervalNum,
        timerHours,
        timerMinutes,
        timerSeconds,
        breakTime,
        breakLength,
        breakMinutes,
        longBreakTime,
        longBreakLength,
        longBreakMinutes,
        isBreak,
        isLongBreak,
        pomCount
    }) => {
    return await apiRequest({
        path: "/timers",
        method: "POST",
        data: {
            userId, 
            name, 
            isPomodoro, 
            currentTime, 
            intervalNum,
            timerHours,
            timerMinutes,
            timerSeconds,
            breakTime,
            breakLength,
            breakMinutes,
            longBreakTime,
            longBreakLength,
            longBreakMinutes,
            isBreak,
            isLongBreak,
            pomCount
        }
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
        path: "/auth/logout",
        method: "DELETE"
    });
    return null;
};