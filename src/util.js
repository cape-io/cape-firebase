import { curry, fill, flow, partial, zipObject } from 'lodash'
import { merge, pick } from 'lodash/fp'
import { rename } from 'cape-lodash'
import { buildTriple, getKey, insertFields, REFS } from 'redux-graph'

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
export function entityPath(item, field = '') {
  return `${item.type}/${item.id}/${field}`
}

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
export function nextAction({ action, next }) {
  return next(action)
}

export function entitySet(firebase, node) {
  const { entity, TIMESTAMP } = firebase
  const item = insertFields(node)
  item.dateCreated = TIMESTAMP
  item.dateModified = TIMESTAMP
  return entityDb(entity, item).set(item)
  .then(() => getDbEntity(firebase, item))
}
export function entityUpdate(firebase, node) {
  const { entity, TIMESTAMP } = firebase
  const item = { ...node, dateModified: TIMESTAMP }
  return entityDb(entity, item).update(item)
  .then(() => getDbEntity(firebase, item))
}
export function triplePut({ entity, TIMESTAMP }, { payload, meta }) {
  const triple = buildTriple(payload)
  const { subject, predicate, object } = triple
  const path = `${REFS}/${predicate}/${getKey(object)}`
  const updateObj = {
    [entityPath(subject, path)]: object,
    [entityPath(subject, 'dateModified')]: TIMESTAMP,
  }
  if (meta.previousSubject) {
    const prevSubj = meta.previousSubject
    updateObj[entityPath(prevSubj, path)] = null
    updateObj[entityPath(prevSubj, 'dateModified')] = TIMESTAMP
  }
  return entity.update(updateObj)
  .then(() => triple)
}

export function arrayTrueObj(arr) {
  if (!arr || !arr.length) return {}
  return zipObject(arr, fill(Array(arr.length), true))
}
