import { get } from 'lodash/fp'
import { select } from 'cape-select'

export const getFirebase = get('firebase')
export const getConfig = select(getFirebase, 'config')
export const getEntityTypes = select(getFirebase, 'entityType')
