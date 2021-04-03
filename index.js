// const http = require('http')
const express = require('express')

//importamos CORS
const cors = require('cors')

const app = express()
// importamos el módulo 'logger' que generamos en un archivo aparte
const logger = require('./loggerMiddleware')

//utilizamos cors, permitiendo el acceso a la API desde cualquier origen
app.use(cors())

app.use(express.json())

// imprimimos info sobre la request en consola
//app.use(logger)

let notes = [
  {
    id: 1,
    content: 'Esta es la primer nota',
    date: '2019-05-30T17:30:31.098Z',
    important: true
  },
  {
    id: 2,
    content: 'Estoy probando una API',
    date: '2019-05-30T18:39:34.091Z',
    important: false
  },
  {
    id: 3,
    content: 'Aca va una última nota!!',
    date: '2019-05-30T19:20:14.298Z',
    important: true
  }
]

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'application/json' })
//   response.end(JSON.stringify(notes))
// })

app.get('/', (request, response) => {
  response.send('<h1>Hola mundo!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)
  response.status(204).end()
})

app.post('/api/notes', (request, response) => {
  const note = request.body
  // validamos si recibimos una nota vacía o no
  if (!note || !note.content) {
    // en caso de estar vacía devolvemos un 400 con el mensaje
    return response.status(400).json({
      error: 'note.content is missing'
    })
  }
  // recuperamos todas las ids para poder luego generar nosotros la ide de una nueva nota
  const ids = notes.map(note => note.id)
  // buscamos la id más grande
  const idMax = Math.max(...ids)

  // creamos la nota a agregar a la lista
  const newNote = {
    id: idMax + 1,
    content: note.content,
    // la propiedad 'important' hacemos que sea opcional,
    // por lo que si no la recibimos la seteamos a false
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString()
  }

  notes = [...notes, newNote]

  // una vez creado el recurso usualmente se devuelve el recurso creado
  response.status(201).json(newNote)
})

app.use((request, response) => {
  response.status(404).json({
    error: 'Content not found'
  })
})

//definimos el número de puerto para que lo tome de la variable de entorno
//en caso de no existir la variable de entorno entonces le asigna el 3001
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
