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
        intervalNumber,
        hours,
        minutes,
        seconds,
        shortBreakTime,
        shortBreakLength,
        shortBreakMinutes,
        longBreakTime,
        longBreakLength,
        longBreakMinutes,
        isShortBreak,
        isLongBreak,
        pomodoroCounter
    }) => {
    return await apiRequest({
        path: "/timers",
        method: "POST",
        data: {
            userId, 
            name, 
            isPomodoro, 
            currentTime, 
            intervalNumber,
            hours,
            minutes,
            seconds,
            shortBreakTime,
            shortBreakLength,
            shortBreakMinutes,
            longBreakTime,
            longBreakLength,
            longBreakMinutes,
            isShortBreak,
            isLongBreak,
            pomodoroCounter
        }
    });
};

export const updateTimer = async (timerId, timerObj) => {
    return await apiRequest({
        path: "/timers/" + timerId,
        method: "PUT",
        data: { 
            name: timerObj.name, 
            isPomodoro: timerObj.isPomodoro, 
            currentTime: timerObj.currentTime, 
            intervalNumber: timerObj.intervalNumber,
            hours: timerObj.hours,
            minutes: timerObj.minutes,
            seconds: timerObj.seconds,
            shortBreakTime: timerObj.shortBreakTime,
            shortBreakLength: timerObj.shortBreakLength,
            shortBreakMinutes: timerObj.shortBreakMinutes,
            longBreakTime: timerObj.longBreakTime,
            longBreakLength: timerObj.longBreakLength,
            longBreakMinutes: timerObj.longBreakMinutes,
            isShortBreak: timerObj.isShortBreak,
            isLongBreak: timerObj.isLongBreak,
            pomodoroCounter: timerObj.pomodoroCounter
        }
    });
};

export const deleteTimer = async (timerId) => {
    return await apiRequest({
        path: "/timers/" + timerId,
        method: "DELETE"
    });
};