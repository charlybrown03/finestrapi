module.exports = (app, connection, cors, corsOptions) => {
  // GET - All guests
  const getGuests = (req, res) => {
    connection.query('SELECT * FROM guests', (err, guests) => {
      if (!err) {
        if (!guests.length) {
          res.statusCode = 404
          res.send({ message: 'Not guests yet' })
          return
        }
        res.send(guests)
      } else {
        res.statusCode = 500
        res.send({ message: 'Opss! Something went wrong!' })
      }
    })
  }

  app.get('/guests', cors(corsOptions), getGuests)
}
