const logTypes = { info: 1, warning: 2, error: 3 }
module.exports.logTypes = logTypes

module.exports.info = (request, description, err) => {
  doLog(request, description, err, logTypes.info)
}

module.exports.warning = (request, description, err) => {
  doLog(request, description, err, logTypes.warning)
}

module.exports.error = (request, description, err) => {
  doLog(request, description, err, logTypes.error)
}

module.exports.getIdentifier = request =>
  request.auth.credentials
    ? request.auth.credentials.userId
    : request.info.remoteAddress

/**
 * Attempts to retrieve the relevant callstack (only calls to code residing within /src/)
 */
module.exports.getRelevantCallstack = () => {
  try {
    let stackTrace = new Error().stack
    return stackTrace
      .split('\n')
      .filter(
        row => row.includes('/src/') && !row.includes('getRelevantCallstack')
      )
  } catch (e) {
    return []
  }
}

const doLog = (request, description, err, type) => {
  const identifier = module.exports.getIdentifier(request)
  const callstack = module.exports.getRelevantCallstack(err)
  const db = request.getDb()
  console.log(
    [
      '\n/* * * * * * * * * * * * * * * * * *',
      ' * LOGGING:',
      ' * description: ' + description,
      ' * error: ' + (err ? err.message : ''),
      ' * type: ' + type,
      ' * identifier: ' + identifier,
      ' * callstack:' + callstack,
      '/* * * * * * * * * * * * * * * * * *\n'
    ].join('\n'),
    err ? err.stack : ''
  )

  db.getModel('logs')
    .create({
      description,
      message: err ? err.message : null,
      code: 'BE' + err ? '_' + err.code : '',
      type,
      identifier,
      callstack
    })
    .catch(logErr => {
      console.error(
        'Logging failed: ',
        logErr
          ? logErr.message + ' in' + logErr.fileName + ':' + logErr.lineNumber
          : '',
        'Original description: ' + description,
        err ? err.message + ' in ' + err.fileName + ':' + err.lineNumber : ''
      )
    })
}
