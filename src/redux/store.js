import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import mainReducer from './../reducers/mainReducer';


let reducers = combineReducers({
    branch1: mainReducer,
});

let store = createStore(reducers, applyMiddleware(thunkMiddleware));

export default store;