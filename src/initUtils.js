export const baseFileUrl = 'https://storage.googleapis.com'
export function getFileUrl(storageBucket) {
  if (!storageBucket) return () => null
  return fileName => [baseFileUrl, storageBucket, fileName].join('/')
}
export default function init(fireApp, { doSignInAnon, storageBucket }) {
  const db = fireApp.database().ref()
  return {
    auth: fireApp.auth(),
    db,
    doSignInAnon: doSignInAnon || false,
    entity: db.child('entity'),
    getFileUrl: getFileUrl(storageBucket),
  }
}
