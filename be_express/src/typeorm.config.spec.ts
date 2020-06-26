import ormconfig from './typeorm.config'

describe('ormconfig', () => {
  it('should have the correct db name', () => {
    expect(ormconfig.database).toBe('forensic_truth')
  })
})
