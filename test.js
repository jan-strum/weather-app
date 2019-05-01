const { expect } = require('chai')
const getLocationData = require('./app')

describe('getLocationData', () => {
  it('should return an object with name, locationKey, and GmtOffset properties', async () => {
    let result = await getLocationData()
    expect(result).to.be.an('object')
    expect(result).to.have.property('name')
    expect(result).to.have.property('locationKey')
    expect(result).to.have.property('GmtOffset')
  })
})
