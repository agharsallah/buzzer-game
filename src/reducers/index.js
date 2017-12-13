import { combineReducers } from 'redux';
import commonReducer from './commonReducer';
var formReducer = require('redux-form').reducer;
import {FORM_SAVE_SUCCESS} from '../actions/actionCreators';

const rootReducer = combineReducers({
    commonReducer,
    form: formReducer.plugin({
        MaterialUiForm: (state, action) => { // <------ 'account' is name of form given to reduxForm()
          switch(action.type) {
            case FORM_SAVE_SUCCESS:
              return undefined;       // <--- blow away form data
            default:
              return state;
          }
        }
      })
})

export default rootReducer