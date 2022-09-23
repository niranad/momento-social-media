import { combineReducers } from 'redux';
import posts from './posts';
import authProfile from './auth';

export default combineReducers({ posts, authProfile });
