// Players
export function addTypeToPlayer(payload) {
  return { type: 'ADD_TYPE_TO_PLAYER', payload};
}

export function addHandShapeToPlayer(payload) {
  return {type: 'ADD_HANDSHAPE_TO_PLAYER', payload};
}

export function addWinner(payload) {
  return {type: 'ADD_WINNER', payload}
}

export function restoreInitialState() {
  return {type: 'RESTORE_INITIAL_STATE'};
}