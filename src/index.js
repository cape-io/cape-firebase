import initializeFirebase from './init'
import middleware from './middleware'
import storeListener from './storeListener'
import init from './initUtils'

export * from './actions'
export * from './util'
export const fireInit = init
export const fireMiddleware = middleware
export const reduxFirebase = storeListener
export default initializeFirebase
