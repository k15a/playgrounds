const initialState = {
  isInstalling: false,
  step: null,
  dependency: null,
}

export default function installProgress(state = initialState, action) {
  switch (action.type) {
    case 'installProgress/START':
      return {
        ...state,
        isInstalling: true,
        dependency: action.dependency,
      }

    case 'installProgress/STEP':
      return {
        ...state,
        step: action.data.message,
      }

    case 'installProgress/DONE':
      return {
        ...state,
        isInstalling: false,
      }

    default:
      return state
  }
}
