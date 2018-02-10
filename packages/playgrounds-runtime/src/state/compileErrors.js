const initialState = []

export default function compileErrors(state = initialState, action) {
  switch (action.type) {
    case 'compileErrors/REPORT_COMPILE_ERRORS':
      return [...state, ...action.errors]

    default:
      return state
  }
}
