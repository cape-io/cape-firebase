import { isFunction } from 'lodash'
import { SUBMIT } from 'redux-field'
import { AUTH, LOGOUT, SAVE_ENTITY, SAVE_TRIPLE } from './actions'
import {
  handleAuth, handleFieldSubmit, handleLogout, handleEntityPut, handleTriplePut,
} from './actionHandlers'
import { arrayTrueObj } from './util'

export const dispatcher = {
  [AUTH]: handleAuth,
  [LOGOUT]: handleLogout,
  [SAVE_ENTITY]: handleEntityPut,
  [SAVE_TRIPLE]: handleTriplePut,
  [SUBMIT]: handleFieldSubmit,
}

export default function fireMiddleware(firebase, entities, handlers = {}) {
  const actions = {
    ...dispatcher,
    ...handlers,
  }
  return store => next => (action) => {
    if (!action.type) return next(action)
    if (isFunction(actions[action.type])) {
      const entityIds = arrayTrueObj(entities)
      return actions[action.type]({ action, entityIds, firebase, next, store })
    }
    return next(action)
  }
}
