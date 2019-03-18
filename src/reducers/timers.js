const defaultState = {
    timers: []
}

export default function timers(state = defaultState, action) {
    switch (action.type) {
        case 'ADD_TIMER':
            return {
                timers: [...state.timers, action.timer]
            };
        default:
            return state;
    }
}