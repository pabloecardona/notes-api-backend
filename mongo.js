//Descripción: archivo encargado de conectarse con la db

//importamos mongoose
const { OnUncaughtException } = require('@sentry/node/dist/integrations');
const mongoose = require('mongoose')
//definimos el conection string que nos provee mongoDB
const connectionString = process.env.MONGO_DB_URI

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

// process.on('uncaughtException', () => {
//     mongoose.disconnect()
// })