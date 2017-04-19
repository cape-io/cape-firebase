import { defaultTo } from 'lodash/fp'

const initState = {
  doSignInAnon: false,
}
const reducer = defaultTo(initState)
export default reducer
