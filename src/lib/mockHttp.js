/**
 * Mock Only for Dev or Test
 */

import MockAdapter from 'axios-mock-adapter'

export default instance => {
  if (process.env.NODE_ENV !== 'production' && process.env.VUE_APP_MOCK === 'on') {
    // eslint-disable-next-line no-console
    console.log('mock mode on')
    return new MockAdapter(instance)
  }
  // eslint-disable-next-line no-console
  console.error(
    `mock mode off, NODE_ENV: ${process.env.NODE_ENV}, VUE_APP_MOCK: ${process.env.VUE_APP_MOCK}`,
  )
  return instance
}
