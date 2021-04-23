const User = require('../models/User')
const {api, getUsers} = require('./helpers')
const mongoose = require('mongoose')
const {server} = require('../index')

describe('Creating a new user', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const user = new User ({
      userName: 'testUser1',
      name: 'user',
      password: 'user'
    })

    await user.save()
  })

  test ('is working as expected with a fresh user', async () => {
    const usersAtStart = await getUsers()

    const newUser = {
      username: 'pabl0oo',
      name: 'Pablo',
      password: 'lacontra'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201) 
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await getUsers()
    
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(user => user.userName)
    expect(usernames).toContain(newUser.username)
  })

  test ('fails when username is already taken', async () => {
    const usersAtStart = await getUsers()
    
    const newUser = {
      username: 'testUser1',
      name: 'Pablo',
      password: 'pass'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400) 
      .expect('Content-Type', /application\/json/)

    expect(result.body.errors.userName.message).toContain(`Error, expected \`userName\` to be unique. Value: \`${newUser.username}\``)
    
    const usersAtEnd = await getUsers()
    
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

//hook que se ejecuta una callback al terminar todos los test. Le decimos
//que cierre la conexión al terminar todos los tests.
afterAll(() => {
  server.close()
  mongoose.connection.close()
})

})

