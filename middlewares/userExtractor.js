//middleware para extraer el user ID del token

const jwt = require('jsonwebtoken')

module.exports = (request, response, next) => {
 //obtenemos el token enviado por el header de la request
 const authorization = request.get('authorization')
  
 let token = null
 //revisamos si el token existe y además si comienza con la palabra 'bearer'
 //en caso de cumplirse recuperamos el token propiamente dicho
 if(authorization && authorization.toLowerCase().startsWith('bearer')){
   token = authorization.substring(7)
 }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
 
 if(!token || !decodedToken.id){
   return response.status(401).json({
     error: 'token missing or invalid'
   })
 }

 //extraemos la id del usuario desde el token
 const {id: userId} = decodedToken

 //guardamos en la request el userId extraído del token
 request.userId = userId

 //pasamos a la siguiente ruta
 next()
}