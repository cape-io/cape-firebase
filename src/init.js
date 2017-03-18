import firebase from 'firebase'

export const baseFileUrl = 'https://storage.googleapis.com'
export const TIMESTAMP = firebase.database.ServerValue.TIMESTAMP
export function getFileUrl(storageBucket) {
  return fileName => [baseFileUrl, storageBucket, fileName].join('/')
}
// Create middleware.
export default function initializeFirebase(config) {
  firebase.initializeApp(config)

  const googleAuth = new firebase.auth.GoogleAuthProvider()
  googleAuth.addScope('https://www.googleapis.com/auth/plus.login')

  const db = firebase.database().ref()

  return {
    auth: firebase.auth(),
    db,
    entity: db.child('entity'),
    getFileUrl: getFileUrl(config.storageBucket),
    googleAuth,
    storage: firebase.storage().ref(),
    TIMESTAMP,
  }
}
