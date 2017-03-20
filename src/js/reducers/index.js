import {combineReducers} from 'redux';
import game from './game';
import players from './players';
import prevLocation from './prevLocation';

const rootReducer = combineReducers({
  game,
  players,
  prevLocation
});

export default rootReducer;