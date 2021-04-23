const mongoose = require('mongoose')
const {server} = require('../index')
const Note = require('../models/Note')

const {initialNotes, api, getAllContentsFromNotes} = require('./helpers')


beforeEach(async () => {
  await Note.deleteMany({})

  //hacemos un for para ir recorriendo cada nota e ir esperando a
  //que se guarde para pasar a la siguiente
  for(const note of initialNotes){
    const noteObject = new Note(note)
    await noteObject.save()
  }
})

describe('GET notes', () => {
  test('returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }) 
  
  test('quantity of initial notes created', async () => {
    const {response} = await getAllContentsFromNotes()
    expect(response.body).toHaveLength(initialNotes.length)
  }) 
  
  test('the first note contains the expected content', async () => {
    //const response = await api.get('/api/notes')
    //expect(response.body[0].content).toContain('Primera')
    // const contents = response.body.map(note => note.content)
    const {contents} = await getAllContentsFromNotes() 
    expect(contents).toContain('Primera nota inicial para testing')
  })

  test('a note without a valid id can not be read', async () => {
    await api
      .get('/api/notes/123')
      .expect(400)
  }) 
})

describe('POST notes', () => {
  test('a valid note can be added', async () => {
    const newNote = {
      content: 'Nota agregada para testing de post',
      important: true
    }
    
    await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
    const {contents, response} = await getAllContentsFromNotes()
    expect(contents).toContain(newNote.content)
    expect(response.body).toHaveLength(initialNotes.length + 1) 
  }) 
  
  test('a note without content can not be added', async () => {
    const newNote = {
      content: '',
      important: true
    }
    
    await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)
    .expect('Content-Type', /application\/json/)
  
    const {contents, response} = await getAllContentsFromNotes()
    expect(response.body).toHaveLength(initialNotes.length)
  }) 
})

describe('DELETE a note', () => {
  test('is possible', async () => {
    //a la respuesta que recibimos llamada 'response' la guardamos en 'firstResponse'
    const {response: firstResponse} = await getAllContentsFromNotes()
    const noteToDelete = firstResponse.body[0]
    
    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .expect(204)
    
    const {response: secondResponse, contents} = await getAllContentsFromNotes()
    expect(secondResponse.body).toHaveLength(initialNotes.length - 1)
    expect(contents).not.toContain(noteToDelete.content)
  })
  
  test('is not possible with an invalid id', async () => {
    await api
      .delete('/api/notes/123')
      .expect(400)
    
    const {response: secondResponse, contents} = await getAllContentsFromNotes()
    expect(secondResponse.body).toHaveLength(initialNotes.length)
  })
})

describe('EDIT a note', () => {
  test('is not possible without content', async () => {
    //a la respuesta que recibimos llamada 'response' la guardamos en 'firstResponse'
    const {response: firstResponse} = await getAllContentsFromNotes()
    const noteToEdit = firstResponse.body[0]
    const newNoteInfo = {}

    await api
      .put(`/api/notes/${noteToEdit.id}`)
      .send(newNoteInfo)
      .expect('Content-Type', /application\/json/)
      .expect(400)
    
    const {response: secondResponse, contents} = await getAllContentsFromNotes()
    expect(secondResponse.body).toHaveLength(initialNotes.length)
    expect(contents).toContain(noteToEdit.content)
  })

  test('is not possible with an invalid id', async () => {
    //a la respuesta que recibimos llamada 'response' la guardamos en 'firstResponse'
    const {response: firstResponse} = await getAllContentsFromNotes()
    const noteToEdit = firstResponse.body[0]
    const newNoteInfo = {
      content: 'Nota modificada en testing',
      important: true
    }

    await api
      .put('/api/notes/123')
      .send(newNoteInfo)
      .expect(400)
    
    const {response: secondResponse, contents} = await getAllContentsFromNotes()
    expect(secondResponse.body).toHaveLength(initialNotes.length)
    expect(contents).toContain(noteToEdit.content)
  })

  test('is possible', async () => {
    //a la respuesta que recibimos llamada 'response' la guardamos en 'firstResponse'
    const {response: firstResponse} = await getAllContentsFromNotes()
    const noteToEdit = firstResponse.body[0]
    const newNoteInfo = {
      content: 'Nota modificada en testing',
      important: true
    }

    await api
      .put(`/api/notes/${noteToEdit.id}`)
      .send(newNoteInfo)
      .expect('Content-Type', /application\/json/)
    
    const {response: secondResponse, contents} = await getAllContentsFromNotes()
    expect(secondResponse.body).toHaveLength(initialNotes.length)
    expect(contents).not.toContain(noteToEdit.content)
    expect(contents).toContain(newNoteInfo.content)
  })
})


//hook que se ejecuta una callback al terminar todos los test. Le decimos
//que cierre la conexión al terminar todos los tests.
afterAll(() => {
  server.close()
  mongoose.connection.close()
})