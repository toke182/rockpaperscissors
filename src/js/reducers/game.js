const initialState = [{
  gameModality: 'hsvm',
  gameType: 'classic',
  gameWinner: {
    id: 0,
    type: 'human',
    handShape: 'rock',
    gameSide: 'left'
  }
}];

export default function game(state = initialState, action) {
  switch (action.type) {
    case 'ADD_NEW_GAME_RULES':
      console.log('Payload: ', action.payload);
      return action.payload;

    default:
      return state;
  }
}