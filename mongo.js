//Descripción: archivo encargado de conectarse con la db

//importamos mongoose
const { OnUncaughtException } = require('@sentry/node/dist/integrations');
const mongoose = require('mongoose')
//definimos el conection string que nos provee mongoDB
const connectionString = 'mongodb+srv://pabloecardona:beaker1123!@cluster0.3i13l.mongodb.net/appDB?retryWrites=true&w=majority'

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