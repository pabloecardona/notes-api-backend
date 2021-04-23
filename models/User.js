//Descripción: archivo en donde se define el esquema y el modelo 'User' correspondiente a los usuarios

//obtenemos las propiedades 'Schema' y 'model' de 'mongoose'
const {model, Schema} = require('mongoose')

//incluímos el unique validator
var uniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema({
    userName: {type: String, unique: true},
    name: {type: String},
    passwordHash: {type: String},
    notes: [{
        type: Schema.Types.ObjectId,
        ref: 'Note'
    }]
})

//aplicamos el plugin 'uniqueValidator' al userSchema
userSchema.plugin(uniqueValidator);

//Le indicamos al schema que cuando nos devuelva un json de un usuario, 
//nos muestre las propiedades de determinada forma (lo transforme)
userSchema.set('toJSON',{
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v

        delete returnedObject.passwordHash
    }
})

//Creamos el modelo 'User'
const User = model('User', userSchema)

//Exportamos el módulo 'User'
module.exports = User