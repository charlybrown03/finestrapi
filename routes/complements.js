module.exports = (app, connection, cors, corsOptions) => {
  // GET - Get all complements
  const get = (req, res) => {
    connection.query('SELECT * FROM complements', (err, complements) => {
      console.info('GET ALL COMPLEMENTS', new Date())
      if (!err) {
        if (!complements.length) {
          res.statusCode = 204
          res.send([])
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
