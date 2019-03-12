const defaultState = {
    test: ""
};

export default function test(defaultState, action) {
    switch (action.type) {
        case 'SET_TEST':
            return action.payload;
        default:
            return defaultState;
    }
}