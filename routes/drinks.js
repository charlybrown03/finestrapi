const ERROR_MESSAGE = 'Opss, something went wrong!'

const ADD_DRINK = 'INSERT INTO drinks (code, name) VALUES (?, ?)'
const FIND_BY_ID = 'SELECT code, name FROM drinks WHERE id = ?'
const FIND_BY_CODE = 'SELECT code, name FROM drinks WHERE code = ?'
const GET_DRINKS = 'SELECT * FROM drinks'

module.exports = (app, connection, cors, corsOptions) => {
  // POST - Create new drink
  const addDrink = (req, res) => {
    const queryParams = [ req.body.code, req.body.name ]

    connection.query(ADD_DRINK, queryParams, (err, response) => {
      if (!err) {
        const req = {
          params: {
            id: response.insertId
          }
        }

        return findById(req, res)
      }

      _sendError(res)
    })
  }

  // GET - Get all drinks
  const getDrinks = (req, res) => {
    connection.query(GET_DRINKS, (err, drinks) => {
      if (!err) {
        if (!drinks.length) {
          res.statusCode = 404
          return res.send({ message: 'Not drinks yet' })
        }

        return res.send(drinks)
      }

      _sendError(res)
    })
  }

  // GET - Return a drink with specified ID
  const findById = (req, res) => {
    _getOne(req.params.id, res, FIND_BY_ID)
  }

  // GET - Return a drink with specified CODE
  const findByCode = (req, res) => {
    _getOne(req.params.code, res, FIND_BY_CODE)
  }

  const _getOne = (params, res, query) => {
    connection.query(query, params, (err, drink) => {
      if (!err) {
        if (!drink.length) {
          res.statusCode = 404
          return res.send({ message: 'This drink does not exist' })
        }

        return res.send(drink[0])
      }

      _sendError(res)
    })
  }

  const _sendError = (res) => {
    res.statusCode = 500
    res.send({ message: ERROR_MESSAGE })
  }

  app.post('/drink', cors(corsOptions), addDrink)
  app.get('/drink/:code', cors(corsOptions), findByCode)
  app.get('/drinks', cors(corsOptions), getDrinks)
}
