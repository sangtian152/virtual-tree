import { memoize } from 'lodash-unified'
import memoOne from 'memoize-one'

export const useCache = (perfMode) => {
    // eslint-disable-next-line
    const _getItemStyleCache = (_,  __, ___) => ({})
    return perfMode
      ? memoize(_getItemStyleCache)
      : memoOne(_getItemStyleCache)
}
