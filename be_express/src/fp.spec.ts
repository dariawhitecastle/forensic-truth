import * as F from './fp'

describe('F', () => {
  it('renameKeys', () => {
    const obj = { x: 1 }
    const map = { x: 'y' }
    expect(F.renameKeys(map, obj)).toEqual({ y: 1 })
  })
})
