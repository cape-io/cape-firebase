import { isFunction } from 'lodash'
import { SUBMIT } from 'redux-field'
import { AUTH, LOGOUT, SAVE_TRIPLE } from './actions'
import { handleAuth, handleFieldSubmit, handleLogout, handleTriplePut } from './actionHandlers'

export const dispatcher = {
  [AUTH]: handleAuth,
  [LOGOUT]: handleLogout,
  [SAVE_TRIPLE]: handleTriplePut,
  [SUBMIT]: handleFieldSubmit,
}

export default function fireMiddleware(firebase) {
  return store => next => (action) => {
    if (!action.type) return next(action)
    if (isFunction(dispatcher[action.type])) {
      return dispatcher[action.type](firebase, store, action, next)
    }
    return next(action)
  }
}
