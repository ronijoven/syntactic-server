require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const utils = require('./utils');

const app = express();
const port = process.env.PORT || 8002;

// db Connection w/ localhost using knex
//const mdb = require('knex-mariadb');
const db = require('knex')({
  client: 'mysql',
  connection: {
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'exam_info'
  }
});

// static user details
const userData = {
  userId: "111111",
  password: "222222",
  name: "Roni Joven",
  username: "ronijoven",
  isAdmin: true
};

// enable CORS
app.use(cors());
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


//middleware that checks if JWT token exists and verifies it if it does exist.
//In all future routes, this helps to know if the request is authenticated or not.
app.use(function (req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.headers['authorization'];
  if (!token) return next(); //if no token, continue

  token = token.replace('Bearer ', '');
  jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
    if (err) {
      return res.status(401).json({
        error: true,
        message: "Invalid user."
      });
    } else {
      req.user = user; //set the user to req so other routes can use it
      next();
    }
  });
});

// Controllers - aka, the db queries
const main = require('./controllers/dbfunction');

// request handlers
app.get('/', (req, res) => {
  if (!req.user) return res.status(401).json(
      { success: false, 
        message: 'Invalid user to access it.' });
    res.send('Welcome to the Node.js Tutorial! - ' + req.user.name);
});

// validate the user credentials
app.post('/users/signin', function (req, res) {
  const user = req.body.username;
  const pwd = req.body.password;

  // return 400 status if username/password is not exist
  if (!user || !pwd) {
    return res.status(400).json({
      error: true,
      message: "Username or Password required."
    });
  }

  // return 401 status if the credential is not match.
  if (user !== userData.username || pwd !== userData.password) {
    return res.status(401).json({
      error: true,
      message: "Username or Password is Wrong."
    });
  }

  // generate token
  const token = utils.generateToken(userData);
  // get basic user details
  const userObj = utils.getCleanUser(userData);
  // return the token along with user details
  return res.json({ user: userObj, token });

});

// verify the token and return it if it's valid
app.get('/verifyToken', function (req, res) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token;
  if (!token) {
    return res.status(400).json({
      error: true,
      message: "Token is required."
    });
  }
  // check token that was passed by decoding token using secret
  jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
    if (err) return res.status(401).json({
      error: true,
      message: "Invalid token."
    });

    // return 401 status if the userId does not match.
    if (user.userId !== userData.userId) {
      return res.status(401).json({
        error: true,
        message: "Invalid user."
      });
    }
    // get basic user details
    var userObj = utils.getCleanUser(userData);
    return res.json({ user: userObj, token });
  });
});

app.get('/address', (req, res) => main.getTableData(req, res, db, 'address'))
app.post('/address', (req, res) => main.postTableData(req, res, db, 'address'))
app.put("/address",  (req, res) => main.putTableData(req, res, db, 'address'))

app.get("/address/col", (req, res) => main.getTableDataByColumn(req, res, db))
app.delete('/api/delete', (req, res) => {
  var reqData  = req.query;
  var id = reqData.id
  var dbname = reqData.dbname
  db(dbname)
    .where('id', id)
    .del()
    .then(item => {
      res.json(item)
    })
    .catch(err => res.status(400).json({dbError: 'db error (delete) data)'}))
})
app.listen(port, () => {
  console.log('Server started on: ' + port);
});