var config = require('../config')

module.exports = function (app) {

  var cors = require('cors');
  var mysql = require('mysql')
  var moment   = require('moment');

  var connection = mysql.createConnection(config())

  app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
  })

  var corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

  addDrink = function (req, res) {
    connection.query('INSERT INTO drinks (code, name) VALUES (?, ?)',
      [ req.body.code, req.body.name ],
      function (err, response) {
        if (!err) {
          var req = {
            params: { id: response.insertId }
          }
          res.send({
            code: req.body.code,
            name: req.body.name,
            id: response.insertId
          })
        } else {
          res.statusCode = 409
          res.send({ message: 'Error creating new drink' })
        }
      }.bind(this))
  }

  // app.get('/hearts', cors(corsOptions), findAllHearts)
  // app.get('/heart/:id', cors(corsOptions), findById)
  app.post('/drink', cors(corsOptions), addDrink)
  // app.patch('/heart/:id', cors(corsOptions), updateHeart)
  // app.delete('/heart/:id', cors(corsOptions), deleteHeart)
  // app.options('/heart/:id', cors(corsOptions))

  // //GET - Return all hearts in the DB
  // findAllHearts = function(req, res) {
  //   connection.query('SELECT * FROM Hearts', function (err, hearts) {
  //     if (!err) {
  //       res.send(hearts)
  //     } else {
  //       res.statusCode = 404
  //       res.send({ message: 'You don\'t have any heart yet' })
  //     }
  //   })
  // };

  // // GET - Return a Heart with specified ID
  // findById = function(req, res) {
  //   connection.query('SELECT * FROM Hearts WHERE id = ?', req.params.id, function (err, heart) {
  //     if (!err) {
  //       res.send(heart)
  //     } else {
  //       res.statusCode = 404
  //       res.send({ message: 'This heart don\'t exist' })
  //     }
  //   })
  // }

  // // POST - Insert a new Heart in the DB
  // addHeart = function(req, res) {
  //   connection.query('INSERT INTO Hearts (color, size, creation_date) VALUES (?, ?, ?)',
  //     [req.body.color, req.body.size, moment().format('DD-MM-YY HH:mm:ss')],
  //     function (err, response) {
  //       if (!err) {
  //         var req = {
  //           params: { id: response.insertId }
  //         }
  //         this.findById(req, res)
  //       } else {
  //         res.statusCode = 409
  //         res.send({ message: 'Error creating new heart' })
  //       }
  //     }.bind(this))
  // }

  // // PATCH - Update a register already exists
  // updateHeart = function(req, res) {
  //   connection.query('UPDATE Hearts SET color=?, size=? WHERE id=?',
  //     [req.body.color, req.body.size, req.params.id],
  //     function (err, response) {
  //       if (!err) {
  //         res.send(response)
  //       } else {
  //         res.statusCode = 409
  //         res.send({ message: 'Error updating heart ' + req.params.id })
  //       }
  //     }
  //   )
  // }

  // // DELETE - Delete a heart with specified ID
  // deleteHeart = function(req, res) {
  //   connection.query('DELETE FROM Hearts WHERE id=?', req.params.id, function (err, response) {
  //     if (!err) {
  //       res.send({ status: 'OK', response: 'Deleted heart ' + req.params.id })
  //     } else {
  //       res.statusCode = 409
  //       res.send({ message: 'Error erasing heart ' + req.params.id })
  //     }
  //   })
  // }

  // // Link routes and functions
  // app.get('/hearts', cors(corsOptions), findAllHearts)
  // app.get('/heart/:id', cors(corsOptions), findById)
  // app.post('/heart', cors(corsOptions), addHeart)
  // app.patch('/heart/:id', cors(corsOptions), updateHeart)
  // app.delete('/heart/:id', cors(corsOptions), deleteHeart)
  // app.options('/heart/:id', cors(corsOptions))

}
