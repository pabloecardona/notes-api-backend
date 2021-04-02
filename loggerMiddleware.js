// declaramos una función que imprime por consola info sobre la request
const logger = (request, response, next) => {
  console.log(request.method)
  console.log(request.path)
  console.log(request.body)
  console.log('-----')
  next() // colocamos el next para que continue evaluando los otros app...
}

// exportamos la función (módulo) como CommonJS
module.exports = logger
