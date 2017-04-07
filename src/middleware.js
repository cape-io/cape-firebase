import { isFunction } from 'lodash'
import { SUBMIT } from 'redux-field'
import { AUTH, DELETE_ENTITY, DELETE_TRIPLE, LOGOUT, SAVE_ENTITY, SAVE_TRIPLE, UPDATE_ENTITY } from './actions'
import {
  handleAuth, handleFieldSubmit,
  handleLogout, handleTriplePut, sendPayload,
} from './actionHandlers'
import { arrayTrueObj, entitySet, entityDelete, entityUpdate, tripleDelete } from './util'

export const dispatcher = {
  [AUTH]: handleAuth,
  [DELETE_ENTITY]: sendPayload(entityDelete),
  [DELETE_TRIPLE]: sendPayload(tripleDelete),
  [LOGOUT]: handleLogout,
  [SAVE_ENTITY]: sendPayload(entitySet),
  [SAVE_TRIPLE]: handleTriplePut,
  [SUBMIT]: handleFieldSubmit,
  [UPDATE_ENTITY]: sendPayload(entityUpdate),
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
