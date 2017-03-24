import firebase from 'firebase'
import init from './initUtils'

// Create middleware.
export default function initializeFirebase(config) {
  firebase.initializeApp(config)

  const googleAuth = new firebase.auth.GoogleAuthProvider()
  googleAuth.addScope('https://www.googleapis.com/auth/plus.login')

  return {
    ...init(firebase, config),
    googleAuth,
  }
}
