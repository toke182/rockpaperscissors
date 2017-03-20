const initialState = {};

export default function prevLocation(state = initialState, action) {
  switch (action.type) {
    case 'ADD_PREVIOUS_LOCATION':
      return Object.assign({}, state, action.payload);

    default:
      return state;
  }
}
