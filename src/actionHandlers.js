import { cond, flow, stubTrue } from 'lodash'
import { get } from 'lodash/fp'
import { set } from 'cape-lodash'
import { clear, fieldValue } from 'redux-field'
import { selectGraph } from 'redux-graph'
import { simpleSelector } from 'cape-select'
import { loginUser } from './handler'
import { entitySet, entityUpdate, nextAction, triplePut } from './util'

export function handleAuth({ firebase, store }) {
  const { auth, googleAuth } = firebase
  // console.log(credential)
  return auth.signInWithPopup(googleAuth).then(flow(get('user'), loginUser(firebase, store)))
}
export function handleLogout({ firebase: { auth }, action, next }) {
  return auth.signOut().then(next(action))
}
export function handleProfileField({ firebase, store: { dispatch, getState }, action, next }) {
  next(action)
  const state = getState()
  const entityPath = action.meta.prefix
  const entity = flow(selectGraph, get(entityPath))(state)
  const fieldId = fieldValue(entityPath, 'id')(state)
  const update = set(entity, fieldId, action.payload)
  entityUpdate(firebase, update)
  .then(() => dispatch(clear(entityPath)))
}
export const isWatchedEntity = simpleSelector(get('action.meta.prefix[0]'), get('entityIds'), get)

export const handleFieldSubmit = cond([
  [isWatchedEntity, handleProfileField],
  [stubTrue, nextAction],
])
export function handleEntityPut({ firebase, action, next }) {
  next(action)
  return entitySet(firebase, action.payload)
}
export function handleTriplePut({ firebase, action, next }) {
  next(action)
  return triplePut(firebase, action)
}
export function handleEntityUpdate({ firebase, action, next }) {
  next(action)
  return entityUpdate(firebase, action.payload)
}
