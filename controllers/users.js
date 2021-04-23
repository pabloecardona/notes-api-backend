//importamos una clase llamada 'router' que pertenece a express
//nos va a permitir crear un router de forma separa a lo que tenemos 
//en index. Es muy similar a un middleware
const usersRouter = require('express').Router()

//importamos bcryp para encriptar la contraseña
const bcrypt = require('bcrypt')
const saltRounds = 10;

//importamos el modelo de users
const User = require('../models/User')

//ahora utilizamos 'usersRouter' como antes usabamos el app.get...
//debemos tener en cuenta que el path es relativo al path que colocamos
//en el app.use que usamos para decirle que vamos a utilizar un router
usersRouter.post('/', async (request, response) => {
  try{
    const {body} = request
    const {username, name, password} = body
  
    const passwordHash = await bcrypt.hash(password, saltRounds)
  
    const user = new User({
      userName: username,
      name,
      passwordHash
    })
  
    const savedUser = await user.save()
  
    response.status(201).json(savedUser)
  }
  catch(error){
    response.status(400).json(error)
  }
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})

  response.json(users)
})

module.exports = usersRouter