const supertest = require('supertest')
const {app} = require('../index')
const api = supertest(app)
const User = require('../models/User')

const initialNotes = [
    {
        content: 'Primera nota inicial para testing',
        important: true,
        date: new Date()
    },
    {
        content: 'Segunda nota inicial para testing',
        important: true,
        date: new Date()
    }
]

const getAllContentsFromNotes = async () => {
    const response = await api.get('/api/notes')
    return {
        contents: response.body.map(note => note.content),
        response
    }
}

const getUsers = async () => {
    const usersDB = await User.find({})
    return usersDB.map(user => user.toJSON())
} 

module.exports = {initialNotes, api, getAllContentsFromNotes, getUsers}