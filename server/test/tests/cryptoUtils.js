'use strict'

const cryptoUtils = require('../../utils/cryptoUtils')

const Code = require('code')
const Lab = require('lab')
const lab = exports.lab = Lab.script()

const describe = lab.describe
const it = lab.it
const expect = Code.expect

describe('Testing crypto utils', () => {
  it('should encrypt and decryt a string', async () => {
    const toEncrypt = 'My nice string! :)'
    const encrypted = cryptoUtils.encryptString(toEncrypt)
    const decrypted = cryptoUtils.decryptString(encrypted)
    expect(encrypted).not.to.equal(toEncrypt)
    expect(decrypted).to.equal(toEncrypt)
  })

  it('should deterministically encrypt and decryt a string', async () => {
    const toEncrypt = 'My nice string! :)'
    const encrypted = cryptoUtils.encryptStringDeterministic(toEncrypt)
    const encrypted2 = cryptoUtils.encryptStringDeterministic(toEncrypt)
    const decrypted = cryptoUtils.decryptString(encrypted)
    const decrypted2 = cryptoUtils.decryptString(encrypted2)
    expect(encrypted).not.to.equal(toEncrypt)
    expect(encrypted).to.equal(encrypted2)
    expect(decrypted).to.equal(toEncrypt)
    expect(decrypted2).to.equal(toEncrypt)
  })

  it('should encrypt and decryt a binary string', async () => {
    const toEncrypt = 'My nice string! :)'
    const encrypted = cryptoUtils.encryptBinary(toEncrypt)
    const decrypted = cryptoUtils.decryptBinary(encrypted.toString('hex'))
    expect(encrypted instanceof Buffer).to.equal(true)
    expect(encrypted.toString()).not.to.equal(toEncrypt)
    expect(decrypted instanceof Buffer).to.equal(true)
    expect(decrypted.toString()).to.equal(toEncrypt)
  })
})
