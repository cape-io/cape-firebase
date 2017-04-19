import { identity, nthArg } from 'lodash'
import { createAction, createSimpleAction, noopAction } from 'cape-redux'
import { buildTriple, requireIdType } from 'redux-graph'

export const AUTH = 'fire/AUTH'
export const auth = noopAction(AUTH)

// @TODO Switch to using cape-graph actions for entities and triples.

export const DELETE_ENTITY = 'fire/DELETE_ENTITY'
export const deleteEntity = createSimpleAction(DELETE_ENTITY, requireIdType, nthArg(1))

export const DELETE_TRIPLE = 'fire/DELETE_TRIPLE'
export const deleteTriple = createSimpleAction(DELETE_TRIPLE, identity, nthArg(1))

export const LOGOUT = 'fire/LOGOUT'
export const logout = noopAction(LOGOUT)

export const SAVE_ENTITY = 'fire/SAVE_ENTITY'
export const saveEntity = createSimpleAction(SAVE_ENTITY, identity, nthArg(1))

export const UPDATE_ENTITY = 'fire/UPDATE_ENTITY'
export const updateEntity = createSimpleAction(UPDATE_ENTITY, identity, nthArg(1))
export function updateEntityFields(entity, fields) {
  return updateEntity({ ...requireIdType(entity), ...fields })
}

export const SAVE_TRIPLE = 'fire/SAVE_TRIPLE'
export const saveTriple = createSimpleAction(SAVE_TRIPLE, buildTriple, nthArg(1))

export const UPLOAD_FILE = 'fire/UPLOAD_FILE'
export const uploadFile = createAction(UPLOAD_FILE)
