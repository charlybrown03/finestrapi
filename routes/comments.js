const ADD_COMMENT = 'INSERT INTO comments (comment, author) values (?, ?)'
const GET_ALL = 'SELECT * FROM comments ORDER BY id desc'

const FIND_BY_ID = `SELECT * FROM comments WHERE id = ?`

module.exports = (app, connection, cors, corsOptions) => {
  // POST - Add new comment
  const add = (req, res) => {
    const queryParams = [
      req.body.comment,
      req.body.author
    ]

    connection.query(ADD_COMMENT, queryParams, (err, comment) => {
      console.info('ADD NEW COMMENT', new Date().toLocaleString())
      if (!err) {
        const req = {
          params: {
            id: comment.insertId
          }
        }

        return findById(req, res)
      }
      _sendError(res)
    })
  }

  // GET - Get all comments
  const get = (req, res) => {
    console.info('GET ALL COMMENTS', new Date().toLocaleString())
    connection.query(GET_ALL, (err, comments) => {
      if (!err) return res.send(comments)

      _sendError(res)
    })
  }

  // GET - Find one by id
  const findById = (req, res) => {
    connection.query(FIND_BY_ID, req.params.id, (err, comments) => {
      console.info('GET ONE COMMENT', new Date().toLocaleString())
      if (!err) return res.send(comments[0] || {})

      _sendError(res)
    })
  }

  const _sendError = (res) => {
    res.statusCode = 500
    res.send({ message: 'Opss, something went wrong!' })
  }

  app.get('/comments', cors(corsOptions), get)
  app.options('/comment', cors(corsOptions))
  app.post('/comment', cors(corsOptions), add)
  app.get('/comment', cors(corsOptions), findById)
}
