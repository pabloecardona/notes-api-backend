//Agregamos el paquete para reconocer las variables de entorno guardadas en el archivo .env
require('dotenv').config()

//Agregamos el archivo 'mongo', al agregarlo lo ejecuta y conecta a la db
require('./mongo')


const express = require('express');

//Agregamos todo lo necesario para Sentry
const Sentry = require('@sentry/node');
const Tracing = require("@sentry/tracing");

const app = express()

//importamos CORS
const cors = require('cors')
// importamos el módulo 'logger' que generamos en un archivo aparte
const logger = require('./loggerMiddleware')

//importamos el modelo de Nota declarado en el archivo 'Note'
const Note = require('./models/Note')

//importamos los middlewares que colocamos en archivos externos
const notFound = require('./middlewares/notFound')
const errorHandler = require ('./middlewares/errorHandler')

//utilizamos cors, permitiendo el acceso a la API desde cualquier origen
app.use(cors())

app.use(express.json())

//inicializamos Sentry
Sentry.init({
  dsn: "https://0595e5d730c34736a7beb75916c417bf@o568098.ingest.sentry.io/5712826",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

// imprimimos info sobre la request en consola
//app.use(logger)

let notes = [
  // {
  //   id: 1,
  //   content: 'Esta es la primer nota',
  //   date: '2019-05-30T17:30:31.098Z',
  //   important: true
  // },
  // {
  //   id: 2,
  //   content: 'Estoy probando una API',
  //   date: '2019-05-30T18:39:34.091Z',
  //   important: false
  // },
  // {
  //   id: 3,
  //   content: 'Aca va una última nota!!',
  //   date: '2019-05-30T19:20:14.298Z',
  //   important: true
  // }
]

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'application/json' })
//   response.end(JSON.stringify(notes))
// })

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.get('/', (request, response) => {
  response.send('<h1>Hola mundo!</h1>')
}) 

//para debuggear Sentry
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

//Al ir a esa uri le decimos que haga un 'find' en la bd, esperamos por la respuesta y la mostramos
app.get('/api/notes', async (request, response) => {
  const notes = await Note.find({})
  response.json(notes)
})

//Forma utilizando promesas sin usar async await
// //Al ir a esa uri le decimos que haga un 'find' en la bd, esperamos por la respuesta y la mostramos
// app.get('/api/notes', (request, response) => {
//   .then(notes => {
//     Note.find({})
//     response.json(notes)
//   })
// })

app.get('/api/notes/:id', async (request, response, next) => {
  // const id = Number(request.params.id)
  const {id} = request.params
  try {
    const note = await Note.findById(id)
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  }
  //en caso de haber un error lo pasamos al siguiente middleware
  catch(error){
    next(error)
  }
    
   
  // const note = notes.find(note => note.id === id)

  // if (note) {
  //   response.json(note)
  // } else {
  //   response.status(404).end()
  // }
})

//para editar una nota usamos el 'put'
app.put('/api/notes/:id', (request, response, next) => {
  const{id} = request.params
  const note = request.body
  // validamos si recibimos una nota vacía o no
  if (!note || !note.content) {
    // en caso de estar vacía devolvemos un 400 con el mensaje
    return response.status(400).json({
      error: 'nothing to update'
    })
  }
  //Cargamos la info a actualizar
  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  Note.findByIdAndUpdate(id, newNoteInfo, {new: true})
    .then(result => {
      response.json(result)
    })
    .catch(error => {
      next(error)
    })
})

// app.delete('/api/notes/:id', (request, response, next) => {
//   const{id} = request.params
//   Note.findByIdAndDelete(id)
//     .then(() => {
//       response.status(204).end()
//     })
//     .catch(error => {
//       next(error)
//     })
// })

app.delete('/api/notes/:id', async (request, response, next) => {
  const{id} = request.params
  try {
    await Note.findByIdAndDelete(id)
    response.status(204).end()
  } 
  catch(error) {
    next(error)
  }
})

app.post('/api/notes', async (request, response) => {
  const note = request.body
  // validamos si recibimos una nota vacía o no
  if (!note || !note.content) {
    // en caso de estar vacía devolvemos un 400 con el mensaje
    return response.status(400).json({
      error: 'note.content is missing'
    })
  }

  //Creamos la nueva nota utilizando el modelo 'Note'
  const newNote = new Note ({
    content: note.content,
    date: new Date().toISOString(),
    important: typeof note.important !== 'undefined' ? note.important : false
  })

  //guardamos la nota en la db y esperamos por la respuesta
  const savedNote = await newNote.save()
  response.status(201).json(savedNote)

  // // recuperamos todas las ids para poder luego generar nosotros la ide de una nueva nota
  // const ids = notes.map(note => note.id)
  // // buscamos la id más grande
  // const idMax = Math.max(...ids)

  // // creamos la nota a agregar a la lista
  // const newNote = {
  //   id: idMax + 1,
  //   content: note.content,
  //   // la propiedad 'important' hacemos que sea opcional,
  //   // por lo que si no la recibimos la seteamos a false
  //   important: typeof note.important !== 'undefined' ? note.important : false,
  //   date: new Date().toISOString()
  // }

  // notes = [...notes, newNote]

  // una vez creado el recurso usualmente se devuelve el recurso creado
  // response.status(201).json(newNote)
})



//usamos un middleware para saber si no entró a ninguno de los anteriores
//entonces devolvemos un 'not found'
app.use(notFound) 

app.use(Sentry.Handlers.errorHandler());

//usamos un middleware especial para los errores.
//como primer parámetro recibe el error
app.use(errorHandler)

//definimos el número de puerto para que lo tome de la variable de entorno
//en caso de no existir la variable de entorno entonces le asigna el 3001
const PORT = process.env.PORT

//guardamos la información del servidor que se creó, para cerrar la conexión luego
//de realizar los tests
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

//exportamos app para poder utilizarla en los tests
module.exports = {app, server}