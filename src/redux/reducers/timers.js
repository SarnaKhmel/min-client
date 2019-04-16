import uuid from 'uuid';

const defaultState = {
    timers: [
        {
            id: uuid(), 
            currentTime: 0, 
            intervalNum: null,
            timerRunning: false,
            timerHours: "00",
            timerMinutes: "00",
            timerSeconds: "00"
        },
        {
            id: uuid(), 
            currentTime: 0, 
            intervalNum: null,
            timerRunning: false,
            timerHours: "00",
            timerMinutes: "00",
            timerSeconds: "00"
        }
    ]
};

export default function timers(state = defaultState, action) {
    switch (action.type) {
        case 'ADD_TIMER':
            return {
                timers: [...state.timers, action.timer]
            };
        case 'REMOVE_TIMER':
            const timersDuplicate = [...state.timers];
            const filteredTimers = timersDuplicate.filter((timer) => timer.id !== action.timerId);
            return {
                timers: filteredTimers
            };
        default:
            return state;
    }
};