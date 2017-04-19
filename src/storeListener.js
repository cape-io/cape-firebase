import { forEach, partial } from 'lodash'
import { dbChanges, handleAuth, typeLoadWatch } from './handler'
import { getEntityTypes } from './select'

// @TODO Move firebase to parent func.
export default function storeListener(firebase, store) {
  firebase.auth.onAuthStateChanged(partial(handleAuth, firebase, store))
  const loadWatchType = typeLoadWatch(firebase, store)
  dbChanges(firebase, store)
  forEach(getEntityTypes(store.getState()), loadWatchType)
  return store
}
