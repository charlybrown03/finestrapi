const config = require('../config')

module.exports = (app) => {
  const cors = require('cors')
  const mysql = require('mysql')

  const connection = mysql.createConnection(config())

  app.use((req, res, next) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*')

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true)

    // Pass to next layer of middleware
    next()
  })

  const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

  /**
    * DRINKS
   **/

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
      if (!err) {
        res.send(drink)
      } else {
        res.statusCode = 404
        res.send({ message: 'This drink don\'t exist' })
      }
    })
  }

  /**
    * GUESTS
   **/

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

  /**
   * ROUTES
   */

  // DRINKS
  app.post('/drink', cors(corsOptions), addDrink)
  app.get('/drink/:id', cors(corsOptions), findById)
  app.get('/drinks', cors(corsOptions), getDrinks)
  // GUESTS
  app.get('/guests', cors(corsOptions), getGuests)
}
