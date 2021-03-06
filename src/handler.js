import { curry, isEmpty, map } from 'lodash'
import { ENTITY_PUT, entityDel, entityPut, ENTITY_PUTALL, getEntity } from 'redux-graph'
import { isAuthenticated, login, logout, setUserId } from 'cape-redux-auth'
import {
  authUsr, ensureIdType, entitySet,
  getChild, getDbEntity, getWatchChild, onChildChanged, onChildRemoved, userEntity,
} from './util'

// @TODO fix cape-redux-reducer to split out db stuff.
// Probably also just want to change children instead of entire thing?
function replaceDb(payload) {
  return { type: 'db/REPLACE_DB', payload }
}

export const loginUser = curry((firebase, { dispatch }, user) => {
  // console.log(pickBy(user, isString))
  const entity = userEntity(user)
  dispatch(login(authUsr(entity)))
  // entitySet(firebase, { ...entity, type: 'GoogleUser' })
  dispatch(entityPut({ ...entity, type: 'GoogleUser' }))
  return getDbEntity(firebase, entity)
  .then((dbEntity) => {
    if (!dbEntity) return entitySet(firebase, entity)
    return null
  })
})

export function handleAuth(firebase, store, fireUser) {
  const { dispatch, getState } = store
  if (fireUser) {
    if (fireUser.isAnonymous) {
      // Save to redux a person entity.
      dispatch(entityPut({ type: 'Person', id: fireUser.uid }))
      return dispatch(setUserId(fireUser.uid))
    }
    return loginUser(firebase, store, fireUser)
  }
  if (isAuthenticated(getState())) return dispatch(logout())
  // Create anon session?
  if (firebase.doSignInAnon) return firebase.auth.signInAnonymously()
  return null
}

export const handleInit = curry(({ dispatch }, type, result) => {
  const payload = map(result, ensureIdType(type))
  if (isEmpty(payload)) return null
  return dispatch({ type: ENTITY_PUTALL, payload, meta: { sendSocket: false } })
})
export const handleChanged = curry(({ dispatch, getState }, typeId, change, key) => {
  const newVal = ensureIdType(typeId, change, key)
  const oldVal = getEntity(getState(), newVal)
  if (oldVal && newVal.dateModified === oldVal.dateModified) return null
  return dispatch({ type: ENTITY_PUT, payload: newVal, meta: { source: 'firebase' } })
})
export const handleRemoved = curry(({ dispatch, getState }, typeId, value, key) =>
  dispatch(entityDel(ensureIdType(typeId, value, key)))
)
export const typeLoader = curry(({ entity }, store, typeId) =>
  getChild(entity, typeId).then(handleInit(store, typeId))
)
export const typeListener = curry(({ entity }, store, typeId) =>
  Promise.all([
    onChildChanged(entity, typeId, handleChanged(store, typeId)),
    onChildRemoved(entity, typeId, handleRemoved(store, typeId)),
  ])
)
// Load init state and then listen for changes.
export const typeLoadWatch = curry((firebase, store, typeId) =>
  Promise.all([
    typeLoader(firebase, store, typeId),
    typeListener(firebase, store, typeId),
  ])
)
export const dbChange = curry(({ dispatch }, result) => dispatch(replaceDb(result)))
export function dbChanges({ db }, store) {
  return getWatchChild(db, 'db', dbChange(store))
}
