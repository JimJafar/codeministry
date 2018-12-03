const Joi = require('joi')

module.exports = {
  headers: Joi.object({ authorization: Joi.string().required() })
    .options({
      allowUnknown: true
    })
}
