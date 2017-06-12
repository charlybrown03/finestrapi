module.exports = (app, connection, cors, corsOptions) => {
  // GET - Get all complements
  const get = (req, res) => {
    connection.query('SELECT * FROM complements', (err, complements) => {
      if (!err) {
        if (!complements.length) {
          res.statusCode = 404
          res.send({ message: 'Not complements yet' })
          return
        }
        res.send(complements)
      } else {
        res.statusCode = 500
        res.send({ message: 'Opss, something went wrong!' })
      }
    })
  }

  app.get('/complements', cors(corsOptions), get)
}
