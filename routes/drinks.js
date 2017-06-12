module.exports = (app, connection, cors, corsOptions) => {
  // POST - Create new drink
  const addDrink = (req, res) => {
    connection.query('INSERT INTO drinks (code, name) VALUES (?, ?)',
      [ req.body.code, req.body.name ],
      function (err, response) {
        if (!err) {
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
    connection.query('SELECT * FROM drinks', (err, drink) => {
      if (!err) {
        res.send(drink)
      } else {
        res.statusCode = 404
        res.send({ message: 'Not drinks yet' })
      }
    })
  }

  // GET - Return a Drink with specified ID
  const findById = (req, res) => {
    connection.query('SELECT * FROM drinks WHERE id = ?', req.params.id, (err, drink) => {
      if (!err && drink.length) {
        res.send(drink)
      } else {
        res.statusCode = 404
        res.send({ message: 'This drink don\'t exist' })
      }
    })
  }

  app.post('/drink', cors(corsOptions), addDrink)
  app.get('/drink/:id', cors(corsOptions), findById)
  app.get('/drinks', cors(corsOptions), getDrinks)
}
