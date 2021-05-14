const ERROR_HANDLERS = {
  CastError: response => response.status(400).end(),
  JsonWebTokenError: response => 
    response.status(401).json({
      error: 'invalid token'
    }).end(),
  TokenExpiredError: response => 
    response.status(401).json({
      error: 'token expired'
    }).end(),
  defaultError: response => response.status(500).end()
}

module.exports = (error, request, response, next) => {
  console.log(error.name);
  const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError
  handler(response, error)
}