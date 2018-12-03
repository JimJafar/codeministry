const Boom = require('boom')

module.exports.notFound = {
  auth: false,
  handler: async (request, h) => {
    throw Boom.notFound('Method does not exist.')
  },
  tags: [ 'api' ],
  description: '404',
  notes: '404'
}
