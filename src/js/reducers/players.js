const initialState = [
  {
    id: 0,
    handShape: 'rock',
    gameSide: 'left'
  },
  {
    id: 1,
    handShape: 'scissors',
    gameSide: 'right'
  }
];

export default function players(state = initialState, action) {
  const nextState = [...state];

  switch (action.type) {
    case 'ADD_TYPE_TO_PLAYER':
      nextState
        .filter(player => player.id === action.payload.id)
        .map(player => player.type = action.payload.type);

      return nextState;
    default:
      return state;
  }
}