export function removeTimer(timerId) {
    return {
        type: "REMOVE_TIMER",
        timerId: timerId
    }
};