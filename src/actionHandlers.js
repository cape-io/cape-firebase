import { cond, flow, partial, stubTrue } from 'lodash'
import { get, pick } from 'lodash/fp'
import { set } from 'cape-lodash'
import { clear, fieldValue } from 'redux-field'
import { selectGraph } from 'redux-graph'
import { simpleSelector } from 'cape-select'
import { updateEntityFields } from './actions'
import { loginUser } from './handler'
import { entityUpdate, nextAction, triplePut } from './util'

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
  // const entity = flow(selectGraph, get(entityPath))(state)
  const entity = { type: entityPath[0], id: entityPath[1] }
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
export function sendPayload(handler) {
  return ({ action, firebase, next }) => {
    next(action)
    return handler(firebase, action.payload)
  }
}

export function handleTriplePut({ firebase, action, next }) {
  next(action)
  return triplePut(firebase, action)
}
// Update entity progress.
export const onFileProgress = (dispatch, entity) => flow(
  pick(['bytesTransferred']),
  partial(updateEntityFields, entity),
  dispatch
)

export function handleFileUpload({ firebase, action, store, next }) {
  const { file, entity } = action.payload
  const uploadTask = firebase.storage.child(entity.fileName).put(file)
  next(action)
  return new Promise((accept, reject) => {
    uploadTask.on('state_changed',
      onFileProgress(store.dispatch, entity),
      reject,
      partial(accept, store)
    )
  })
}
