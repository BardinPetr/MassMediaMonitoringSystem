import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';
import {routerReducer} from 'react-router-redux';
import keplerGlReducer from 'kepler.gl/reducers';

const initialAppState = {
    appName: 'example',
    loaded: false
};

const reducers = combineReducers({
    keplerGl: keplerGlReducer,
    app: handleActions({}, initialAppState),
    routing: routerReducer
});

export default reducers;
