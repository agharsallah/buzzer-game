import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import App from './container/App';
import Admin from './container/Admin';
import { Route, Router, Redirect, Switch } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const customHistory = createBrowserHistory()

import './custom.sass';

const index = (
    <Provider store={ store }>
    <MuiThemeProvider muiTheme={getMuiTheme()}>
    <Router history={customHistory}>
    <Switch>
    
    <Route exact path="/" component={App}/> 
    <Route exact path="/admin" component={Admin}/> 
    </Switch>
    
        </Router>
    </MuiThemeProvider>
        </Provider>
)

render(index, document.getElementById('app'))