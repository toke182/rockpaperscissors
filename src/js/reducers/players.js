const initialState = [
  {
    id: 0,
    gameSide: 'left'
  },
  {
    id: 1,
    gameSide: 'right'
  }
];

export default function players(state = initialState, action) {
  switch (action.type) {
    case 'ADD_TYPE_TO_PLAYER':
      return state.map(player =>
        player.id === action.payload.id ?
          Object.assign({}, player, {type: action.payload.type}) : player
      );

    case 'ADD_HANDSHAPE_TO_PLAYER':
      return state.map(player =>
        player.id === action.payload.id ?
          Object.assign({}, player, {handShape: action.payload.handShape}) : player
      );

    case 'ADD_WINNER':
      return state.map(player =>
      player.id === action.payload.id ?
        Object.assign({}, player, {winner: true}) : player
      );

    case 'RESTORE_INITIAL_STATE':
      return [...initialState];

    default:
      return state;
  }
}