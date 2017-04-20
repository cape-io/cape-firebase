import { defaultTo } from 'lodash/fp'

const initState = {
  config: {},
  entityType: {},
  doSignInAnon: false,
}
const reducer = defaultTo(initState)
export default reducer
