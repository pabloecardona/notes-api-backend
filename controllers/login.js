//importamos el json web token
const jwt = require('jsonwebtoken')

const bcrypt = require('bcrypt')
const saltRounds = 10;
const User = require('../models/User');

const loginRouter = require('express').Router()

loginRouter.post('/', async (request, response) => {
  //obtenemos el nombre de usuario de la petición de logueo
  const {username, password} = request.body
  //buscamos ese usuario en la db
  const user = await User.findOne({userName: username})

  //revisamos si existe el usuario o no. En caso de existir controlamos la 
  //contraseña. En caso de no exisitir el usuario o no ser correcta la contraseña
  //entonces devolvemos error. Así no damos pistas de qué es lo que está incorrecto
  const passwordCorrect = user ===  null 
    ? false
    : await bcrypt.compare(password, user.passwordHash)

    if(!passwordCorrect){
      response.status(401).json({
        error: 'invalid user or password'
      })
    }

    //Creamos la info que queremos guardar en el token
    const userForToken = {
      id: user._id,
      username: user.userName
    }

    //creamos el token con el contenido, la palabra secreta y el tiempo de validez
    const token = jwt.sign(
      userForToken, 
      process.env.JWT_SECRET, 
      {
        //definimos que el token expire luego de 10 minutos (600 segundos)
        expiresIn: 600
      })

    response.send({
      name: user.name,
      username: user.userName,
      token
    })
})

module.exports = loginRouter