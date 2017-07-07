const config = require('../config')

module.exports = (app) => {
  const cors = require('cors')
  const mysql = require('mysql')

  const connection = mysql.createConnection(config())

  const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

  require('./comments')(app, connection, cors, corsOptions)
  require('./complements')(app, connection, cors, corsOptions)
  require('./drinks')(app, connection, cors, corsOptions)
  require('./guests')(app, connection, cors, corsOptions)
}
