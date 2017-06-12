const ERROR_MESSAGE = 'Opss, something went wrong!'

module.exports = (app, connection, cors, corsOptions) => {
  // POST - Create new drink
  const addDrink = (req, res) => {
    connection.query('INSERT INTO drinks VALUES (?, ?)',
      [ req.body.code, req.body.name ],
      function (err, response) {
        if (!err) {
          console.info(response)
          var req = {
            params: { id: response.insertId }
          }
          this.findById(req, res)
        } else {
          res.statusCode = 409
          res.send({ message: 'Error creating new drink' })
        }
      }.bind(this))
  }

  // GET - Get all drinks
  const getDrinks = (req, res) => {
    connection.query('SELECT * FROM drinks', (err, drinks) => {
      if (!err) {
        if (!drinks.length) {
          res.statusCode = 404
          return res.send({ message: 'Not drinks yet' })
        }
        return res.send(drinks)
      }

      sendError(res)
    })
  }

  // GET - Return a drink with specified ID
  const findById = (req, res) => {
    connection.query('SELECT * FROM drinks WHERE code = ?', req.params.code, (err, drink) => {
      if (!err) {
        if (!drink.length) {
          res.statusCode = 404
          return res.send({ message: 'This drink does not exist' })
        }
        return res.send(drink[0])
      }

      sendError(res)
    })
  }

  const sendError = (res) => {
    res.statusCode = 500
    res.send({ message: ERROR_MESSAGE })
  }

  app.post('/drink', cors(corsOptions), addDrink)
  app.get('/drink/:code', cors(corsOptions), findById)
  app.get('/drinks', cors(corsOptions), getDrinks)
}
