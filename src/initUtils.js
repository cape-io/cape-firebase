export const baseFileUrl = 'https://storage.googleapis.com'
export function getFileUrl(storageBucket) {
  return fileName => [baseFileUrl, storageBucket, fileName].join('/')
}
export default function init(fireApp, { storageBucket }) {
  const db = fireApp.database().ref()
  return {
    auth: fireApp.auth(),
    db,
    entity: db.child('entity'),
    getFileUrl: getFileUrl(storageBucket),
    storage: fireApp.storage().ref(),
  }
}
