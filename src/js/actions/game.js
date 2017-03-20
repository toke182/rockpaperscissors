// Games
export function addNewGameRules(payload) {
  return {type: 'ADD_NEW_GAME_RULES', payload};
}

export function decrementSecondsRemaining(){
  return {type: 'DECREMENT_SECONDS_REMAINING'};
}