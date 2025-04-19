const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv').config()

const userRoutes = require('./database_api/user.api')
const censorDataRoutes = require('./database_api/censor_data.api')
const actionRoutes = require('./database_api/action.api')

const mqttCensorDataRoutes = require('./mqtt_api/censor_data.api')
const mqttActionRoutes = require('./mqtt_api/action.api')

const app = express()
app.use(cors())
app.use(express.json())

app.use('/auth', userRoutes)
app.use('/censor-data', censorDataRoutes)
app.use('/actions', actionRoutes)

app.use('/mqtt-censor-data', mqttCensorDataRoutes)
app.use('/mqtt-actions', mqttActionRoutes)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Listening port ${PORT}....`)
})