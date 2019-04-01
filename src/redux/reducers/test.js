
export default function test(state = "", action) {
    switch (action.type) {
        case 'SET_TEST':
            return action.payload;
        default:
            return state;
    }
}