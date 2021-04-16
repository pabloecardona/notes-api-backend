//Descripción: archivo encargado de conectarse con la db

//importamos mongoose
//const { OnUncaughtException } = require('@sentry/node/dist/integrations');
const mongoose = require('mongoose')

//extraemos las variables de entorno:
const {MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV} = process.env

//definimos el conection string que nos provee mongoDB
//según si estamos en modo testing o no
const connectionString = NODE_ENV === 'test' ? MONGO_DB_URI_TEST : MONGO_DB_URI

//conexión a mongoDB
mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then(() => {
        console.log('Database connected');
    })
    .catch(err => {
        console.error(err);
    })

process.on('uncaughtException', error => {
    console.error(error)
    mongoose.disconnect()
    
})