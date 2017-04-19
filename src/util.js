import { curry, flow, get, partial } from 'lodash'
import { join, merge, pick } from 'lodash/fp'
import { rename } from 'cape-lodash'
import { fullRefPath, getPath, insertFields } from 'redux-graph'

export const userFields = pick([
  'displayName', 'email', 'emailVerified', 'isAnonymous', 'photoURL', 'uid',
])
export const userEntity = flow(
  userFields,
  rename({ displayName: 'name', photoURL: 'image', uid: 'id' }),
  merge({ type: 'Person' }),
)
export const authUsr = pick(['id', 'type'])

export const ensureIdType = curry((type, item, id) =>
  (item.id && item.type && item) || { ...item, id, type }
)
export function entityDb(db, item) {
  if (!item) throw new Error('2nd arg must be item object.')
  if (!item.type) {
    console.error(item)
    throw new Error('item must include type.')
  }
  if (!item.id) {
    console.error(item)
    throw new Error('item must include type.')
  }
  return db.child(item.type).child(item.id)
}
export const entityPath = flow(getPath, join('/'))

export function getValue(method, db, id) {
  return db.child(id)[method]('value').then(res => res.val())
}
export const getChild = partial(getValue, 'once')
export function getDbEntity(firebase, entity) {
  return getChild(firebase.entity.child(entity.type), entity.id)
}
export const onChild = curry((actionType, db, id, callback) =>
  db.child(id).on(actionType, res => callback(res.val(), res.key))
)
export const getWatchChild = onChild('value')
export const onChildChanged = onChild('child_changed')
export const onChildRemoved = onChild('child_removed')

export function nextAction({ action, next }) {
  return next(action)
}
export function entityDelete(firebase, item) {
  return entityDb(firebase.entity, item).set(null)
}
export function entitySet(firebase, node) {
  const { entity, TIMESTAMP } = firebase
  const item = insertFields(node)
  item.dateCreated = TIMESTAMP
  item.dateModified = TIMESTAMP
  return entityDb(entity, item).set(item)
  .then(() => getDbEntity(firebase, item))
}
// Same as entitySet but does not create dateCreated field.
export function entityUpdate(firebase, node) {
  const { entity, TIMESTAMP } = firebase
  const item = { ...node, dateModified: TIMESTAMP }
  return entityDb(entity, item).update(item)
  .then(() => getDbEntity(firebase, item))
}
export function getTriplePath(subject, predicate, object, single) {
  return fullRefPath(subject, predicate, single ? null : object).join('/')
}
export function tripleDelete({ entity, TIMESTAMP }, payload) {
  const { subject, predicate, object, single } = payload
  return entity.update({
    [getTriplePath(subject, predicate, object, single)]: null,
    [entityPath(subject, 'dateModified')]: TIMESTAMP,
  })
}
// Use action instead of calling this directly.
// Save refs to subject.
export function triplePut({ entity, TIMESTAMP }, { payload, meta }) {
  // Payload needs to be a have triple style object props.
  const { subject, predicate, object, single } = payload
  const updateObj = {
    [getTriplePath(subject, predicate, object, single)]: object,
    [entityPath(subject, 'dateModified')]: TIMESTAMP,
  }
  // Allow a previously linked subject to change.
  const prevSubj = get(meta, 'previousSubject')
  if (prevSubj) {
    updateObj[getTriplePath(prevSubj, predicate, object, single)] = null
    updateObj[entityPath(prevSubj, 'dateModified')] = TIMESTAMP
  }
  return entity.update(updateObj)
  .then(() => payload)
}
