import { createAction, noopAction } from 'cape-redux'

export const AUTH = 'fire/AUTH'
export const auth = noopAction(AUTH)

export const LOGOUT = 'fire/LOGOUT'
export const logout = noopAction(LOGOUT)

export const SAVE_TRIPLE = 'fire/SAVE_TRIPLE'
export const saveTriple = createSimpleAction(SAVE_TRIPLE, identity, nthArg(1))

export const UPLOAD_FILE = 'fire/UPLOAD_FILE'
export const uploadFile = createAction(UPLOAD_FILE)
