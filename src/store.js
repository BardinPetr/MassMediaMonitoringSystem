import {applyMiddleware, compose, createStore} from 'redux';

import window from 'global/window';
import {taskMiddleware} from 'react-palm/tasks';
import {routerMiddleware} from 'react-router-redux';
import {hashHistory} from 'react-router';
import reducers from './reducers';

export const middlewares = [
    taskMiddleware,
    routerMiddleware(hashHistory)
];

export const enhancers = [applyMiddleware(...middlewares)];

const initialState = {};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(
    reducers,
    initialState,
    composeEnhancers(...enhancers)
);
