const crypto = require('crypto')
const env = process.env.NODE_ENV || 'development'
const cryptoAlgorithm = 'aes-256-cbc'
// AES requires 128 bits
const ivLength = 16
const encryptionKey = ['development', 'localtest'].includes(env)
  ? 'tW0LKP5lg2VHVYmMLtLPNcX6DXMjXvvE'
  : process.env.ENCRYPTION_KEY

/**
 * Encrypts a string
 * @param text
 * @param encoding
 */
module.exports.encryptString = (text, encoding = 'utf8') => {
  if (!text) {
    // cannot encrypt null or undefined
    return text
  }
  const iv = crypto.randomBytes(ivLength)
  const cipher = crypto.createCipheriv(cryptoAlgorithm, Buffer.from(encryptionKey), iv)

  return `${iv.toString('hex')}:${cipher.update(text, encoding, 'hex')}${cipher.final('hex')}`
}

/**
 * Decrypts a string
 * @param encrypted
 * @param encoding
 */
module.exports.decryptString = (encrypted, encoding = 'utf8') => {
  if (!encrypted) {
    // cannot decrypt null or undefined
    return encrypted
  }
  let decrypted, encryptedText
  try {
    const iv = Buffer.from(encrypted.split(':').shift(), 'hex')
    encryptedText = Buffer.from(encrypted.split(':').pop(), 'hex')
    const decipher = crypto.createDecipheriv(cryptoAlgorithm, Buffer.from(encryptionKey), iv)
    decrypted = `${decipher.update(encryptedText, 'hex', encoding)}${decipher.final()}`
  } catch (err) {
    err.message = `${err.message}: "${encryptedText.toString('hex').substr(0, 100)}"...`
    throw err
  }
  return decrypted.toString()
}

/**
 * Deterministically encrypts a string.
 * WARNING: Should only be used for unique values (e.g. primary keys) to avoid inference from matching IVs
 * @param text
 * @param encoding
 */
module.exports.encryptStringDeterministic = (text, encoding = 'utf8') => {
  if ([null, undefined].includes(text)) {
    // cannot encrypt null or undefined
    return text
  }
  const iv = crypto
    .createHash('md5')
    .update(`mx%${text}`)
    .digest('hex')

  const cipher = crypto.createCipheriv(cryptoAlgorithm, Buffer.from(encryptionKey), Buffer.from(iv, 'hex'))

  return `${iv.toString('hex')}:${cipher.update(text, encoding, 'hex')}${cipher.final('hex')}`
}

/**
 * Encrypts binary data
 * @param data
 */
module.exports.encryptBinary = data => {
  if ([null, undefined].includes(data)) {
    return data // cannot encrypt null or undefined
  }

  const iv = crypto.randomBytes(ivLength)
  const cipher = crypto.createCipheriv(cryptoAlgorithm, Buffer.from(encryptionKey), iv)

  const update = cipher.update(data).toString('hex')
  const final = cipher.final().toString('hex')

  return Buffer.from(`${iv.toString('hex')}:${update}${final}`)
}

/**
 * Decrypts binary data
 * @param encryptedData
 */
module.exports.decryptBinary = encrypted => {
  if ([null, undefined].includes(encrypted)) {
    // cannot decrypt null or undefined
    return encrypted
  }
  const encoded = Buffer.from(encrypted, 'hex').toString()
  const iv = Buffer.from(encoded.split(':').shift(), 'hex')
  const encryptedData = Buffer.from(encoded.split(':').pop(), 'hex')
  const decipher = crypto.createDecipheriv(cryptoAlgorithm, Buffer.from(encryptionKey), iv)
  let decrypted
  try {
    decrypted = Buffer.concat([
      decipher.update(encryptedData),
      decipher.final()
    ])
  } catch (err) {
    // append the problematic string to the error to aid in debugging
    err.message = `${err.message}: "${encryptedData.toString().substr(0, 100)}"...`
    throw err
  }
  return decrypted
}
