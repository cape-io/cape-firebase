import { identity, nthArg } from 'lodash'
import { createAction, createSimpleAction, noopAction } from 'cape-redux'
import { buildTriple } from 'redux-graph'

export const AUTH = 'fire/AUTH'
export const auth = noopAction(AUTH)

export const LOGOUT = 'fire/LOGOUT'
export const logout = noopAction(LOGOUT)

export const SAVE_ENTITY = 'fire/SAVE_ENTITY'
export const saveEntity = createSimpleAction(SAVE_ENTITY, identity, nthArg(1))

export const UPDATE_ENTITY = 'fire/UPDATE_ENTITY'
export const updateEntity = createSimpleAction(UPDATE_ENTITY, identity, nthArg(1))

export const SAVE_TRIPLE = 'fire/SAVE_TRIPLE'
export const saveTriple = createSimpleAction(SAVE_TRIPLE, buildTriple, nthArg(1))

export const UPLOAD_FILE = 'fire/UPLOAD_FILE'
export const uploadFile = createAction(UPLOAD_FILE)
