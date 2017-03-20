const initialState = {
  secondsRemaining: 3
};

export default function game(state = initialState, action) {
  switch (action.type) {
    case 'ADD_NEW_GAME_RULES':
      return Object.assign({}, state, action.payload);

    case 'DECREMENT_SECONDS_REMAINING':
      return Object.assign({}, state, {secondsRemaining: state.secondsRemaining - 1});

    case 'RESET_SECONDS_REMAINING':
      return Object.assign({}, state, {secondsRemaining: initialState.secondsRemaining});

    case 'RESTORE_INITIAL_STATE':
      return Object.assign({}, initialState);

    default:
      return state;
  }
}
