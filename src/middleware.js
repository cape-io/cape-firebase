import { isFunction } from 'lodash'
import { SUBMIT } from 'redux-field'
import { AUTH, LOGOUT, SAVE_ENTITY, SAVE_TRIPLE } from './actions'
import {
  handleAuth, handleFieldSubmit, handleLogout, handleEntityPut, handleTriplePut,
} from './actionHandlers'

export const dispatcher = {
  [AUTH]: handleAuth,
  [LOGOUT]: handleLogout,
  [SAVE_ENTITY]: handleEntityPut,
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
