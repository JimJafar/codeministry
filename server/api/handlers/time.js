module.exports.now = {
  tags: ['api'],
  description: 'Get the server time',
  notes: 'Get the server time',
  auth: false,
  handler: async (request, h) => {
    const now = new Date()
    return {
      utc: now.toUTCString(),
      iso: now.toISOString(),
      timestamp: now.getTime()
    }
  }
}
