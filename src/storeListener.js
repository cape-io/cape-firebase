import { forEach, partial } from 'lodash'
import { dbChanges, handleAuth, typeLoadWatch } from './handler'

// @TODO Move firebase to parent func.
export default function storeListener(types) {
  return (firebase, store) => {
    firebase.auth.onAuthStateChanged(partial(handleAuth, firebase, store))
    const loadWatchType = typeLoadWatch(firebase, store)
    dbChanges(firebase, store)
    forEach(types, loadWatchType)
    return store
  }
}
