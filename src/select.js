import { get } from 'lodash/fp'
import { select } from 'cape-select'

export const getConfig = get('firebase')
export const getEntityTypes = select(getConfig, 'entityType')
