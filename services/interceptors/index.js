import errorHandler from './error-handler-interceptor'

export default {
  setup: axios => {
    errorHandler.use(axios)
  }
}
