import { combineReducers } from 'redux';
import commonReducer from './commonReducer';
var formReducer = require('redux-form').reducer;

const rootReducer = combineReducers({
    commonReducer,
    form: formReducer
})

export default rootReducer