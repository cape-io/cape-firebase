import initializeFirebase from './init'
import middleware from './middleware'

export * from './actions'
export * from './util'
export const fireMiddleware = middleware

export default initializeFirebase
