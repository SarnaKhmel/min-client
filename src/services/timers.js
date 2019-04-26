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
        hourInput,
        minuteInput,
        secondInput,
        shortBreakTime,
        shortBreakLength,
        shortBreakMinuteInput,
        longBreakTime,
        longBreakLength,
        longBreakMinuteInput,
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
            hourInput,
            minuteInput,
            secondInput,
            shortBreakTime,
            shortBreakLength,
            shortBreakMinuteInput,
            longBreakTime,
            longBreakLength,
            longBreakMinuteInput,
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
            hourInput: timerObj.hourInput,
            minuteInput: timerObj.minuteInput,
            secondInput: timerObj.secondInput,
            shortBreakTime: timerObj.shortBreakTime,
            shortBreakLength: timerObj.shortBreakLength,
            shortBreakMinuteInput: timerObj.shortBreakMinuteInput,
            longBreakTime: timerObj.longBreakTime,
            longBreakLength: timerObj.longBreakLength,
            longBreakMinuteInput: timerObj.longBreakMinuteInput,
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