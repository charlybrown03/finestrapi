const ERROR_MESSAGE = 'Opss, something went wrong!'
// const NOT_FOUND_PLURAL = 'Not guests yet'
// const NOT_FOUND_SINGLE = 'This guest does not exist'

const GUEST_ATTRIBUTES = `id, name, surname,
                          drink_code AS drinkCode,
                          complement_code AS complementCode`

const GET_GUESTS = `SELECT ${GUEST_ATTRIBUTES} FROM guests`
const FIND_BY_ID = `SELECT ${GUEST_ATTRIBUTES} FROM guests WHERE id = ?`
const ADD_GUEST = `INSERT INTO guests (name, surname, drink_code, complement_code)
                    VALUES (?, ?, ?, ?)`

module.exports = (app, connection, cors, corsOptions) => {
  // POST - Create new guests
  const add = (req, res) => {
    const params = req.body
    const queryParams = [
      params.name,
      params.surname,
      params.drinkCode,
      params.complementCode
    ]

    connection.query(ADD_GUEST, queryParams, (err, guest) => {
      console.info('CREATE NEW GUEST', new Date().toLocaleString())
      if (!err) {
        const req = {
          params: {
            id: guest.insertId
          }
        }

        return findById(req, res)
      }

      _sendError(res)
    })
  }

  // GET - All guests
  const get = (req, res) => {
    connection.query(GET_GUESTS, (err, guests) => {
      console.info('GET ALL GUESTS', new Date().toLocaleString())
      if (!err) {
        if (!guests.length) {
          return _sendResponse(res, [])
        }
        return _sendResponse(res, guests)
      }

      _sendError(res)
    })
  }

  // GET - Find one by id
  const findById = (req, res) => {
    _getOne(req.params.id, res, FIND_BY_ID)
  }

  const _getOne = (params, res, query) => {
    connection.query(query, params, (err, guests) => {
      console.info('GET ONE GUEST', new Date().toLocaleString())
      if (!err) {
        if (!guests.length) {
          return _sendResponse(res, {})
        }

        return _sendResponse(res, guests[0])
      }

      _sendError(res)
    })
  }

  const _sendResponse = (res, content) => {
    res.setHeader('Cache-Control', 'max-age=2592000')
    res.send(content)
  }

  const _sendError = (res) => {
    res.statusCode = 500
    _sendResponse(res, { message: ERROR_MESSAGE })
  }

  app.post('/guest', cors(corsOptions), add)
  app.options('/guest', cors(corsOptions))
  app.get('/guest/:id', cors(corsOptions), findById)
  app.get('/guests', cors(corsOptions), get)
}
