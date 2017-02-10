import firebase from 'firebase'

export const config = {
  apiKey: 'AIzaSyC2qrRL96vy5yLBFvtdVt7kELnY7wdUSls',
  authDomain: 'sailboatdata-e0e5b.firebaseapp.com',
  databaseURL: 'https://sailboatdata-e0e5b.firebaseio.com',
  storageBucket: 'sailboatdata-e0e5b.appspot.com',
}
firebase.initializeApp(config)

export const TIMESTAMP = firebase.database.ServerValue.TIMESTAMP
export const auth = firebase.auth()
export const googleAuth = new firebase.auth.GoogleAuthProvider()
googleAuth.addScope('https://www.googleapis.com/auth/plus.login')

export const db = firebase.database().ref()
export const entity = db.child('entity')

export const storage = firebase.storage().ref()

export const baseFileUrl = 'https://storage.googleapis.com'

export function getFileUrl(fileName) {
  return [baseFileUrl, config.storageBucket, fileName].join('/')
}
