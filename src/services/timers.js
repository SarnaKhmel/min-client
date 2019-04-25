import apiRequest from './api';

export const getMultiTimers = async (userId) => {
    return await apiRequest({
        path: "/users/" + userId + "/multitimers",
        method: 'GET'
    });
};

export const getPomodoro = async (userId) => {
    return await apiRequest({
        path: "/users/" + userId + "/pomodoro",
        method: 'GET'
    });
}

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

export const putTimer = async (timerId, timerObj) => {
    return await apiRequest({
        path: "/timers/" + timerId,
        method: "PUT",
        data: { 
            name: timerObj.name, 
            isPomodoro: timerObj.isPomodoro, 
            currentTime: timerObj.currentTime, 
            intervalNum: timerObj.intervalNum,
            timerHours: timerObj.timerHours,
            timerMinutes: timerObj.timerMinutes,
            timerSeconds: timerObj.timerSeconds,
            breakTime: timerObj.breakTime,
            breakLength: timerObj.breakLength,
            breakMinutes: timerObj.breakMinutes,
            longBreakTime: timerObj.longBreakTime,
            longBreakLength: timerObj.longBreakLength,
            longBreakMinutes: timerObj.longBreakMinutes,
            isBreak: timerObj.isBreak,
            isLongBreak: timerObj.isLongBreak,
            pomCount: timerObj.pomCount
        }
    });
};

export const deleteTimer = async (timerId) => {
    return await apiRequest({
        path: "/timers/" + timerId,
        method: "DELETE"
    });
};