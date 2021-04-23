//Descripción: archivo en donde se define el esquema y el modelo 'Note' correspondiente a las notas

//obtenemos las propiedades 'Schema' y 'model' de 'mongoose'
const {model, Schema} = require('mongoose')

const noteSchema = new Schema({
    content: String,
    date: Date,
    important: Boolean,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

//Le indicamos al schema que cuando nos devuelva un json de una nota, 
//nos muestre las propiedades de determinada forma (lo transforme)
noteSchema.set('toJSON',{
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})


//Creamos el modelo 'Note'
const Note = model('Note', noteSchema)

//Exportamos el módulo 'Note'
module.exports = Note

// //Buscamos los documentos guardados
// Note.find({})
//     .then(result => {
//         console.log(result);
//         mongoose.connection.close()
//     })

// //Creamos una instancia de 'Note'
// const note = new Note({
//     content: 'Esta es la primer nota de la bd en Mongo',
//     date: new Date(),
//     important: true
// })

// //Guardamos el documento
// note.save()
//     .then(result => {
//         console.log(result);
//         mongoose.connection.close()
//     })
//     .catch(err => {
//         console.log(err);
//     })