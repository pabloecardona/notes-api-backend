const supertest = require('supertest')
const {app} = require('../index')
const api = supertest(app)

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

module.exports = {initialNotes, api, getAllContentsFromNotes}