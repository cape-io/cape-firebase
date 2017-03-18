import { fill, isFunction, zipObject } from 'lodash'
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

export default function fireMiddleware(firebase, entities) {
  return store => next => (action) => {
    if (!action.type) return next(action)
    if (isFunction(dispatcher[action.type])) {
      const entityIds = zipObject(entities, fill(entities, true))
      return dispatcher[action.type]({ action, entityIds, firebase, next, store })
    }
    return next(action)
  }
}
