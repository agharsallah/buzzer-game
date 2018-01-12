import io from 'socket.io-client';

const initialState = {
    uid: '',
    username: '',
    userlist: {},
    messages: [],
    errorinfo: '',
    score: 0,
    socket: io()
}

export default function commonFn(state = initialState, action) {
    switch (action.type) {
        case 'SET_USERINFO':
            return Object.assign({}, state, action.userinfo)
        case 'SET_USERID':
            return Object.assign({}, state, { uid: action.uid })
        case 'UPDATE_USERLIST':
            return Object.assign({}, state, { userlist: action.userlist })
        case 'UPDATE_MESSAGE':
            return Object.assign({}, state, { messages: [...state.messages, action.messages] })
        case 'CLEAR_MESSAGE':
            return Object.assign({}, state, { messages: [] })
        /* case 'CHANGE_MESSAGEBOXCOLOR':
            return Object.assign({}, state, { msgboxcolor: action.color }) */
        case 'SET_ERRORINFO':
            return Object.assign({}, state, { errorinfo: action.error })
        case 'UPDATE_SCORE':
            return Object.assign({}, state, { score: action.userlist })
        default:
            return state
    }
}