const express = require('express');
const formidable = require('express-formidable');
const path = require('path');
const mysql1 = require('mysql2');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
// const { error } = require('console');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const verifyTokens = require('./authorization')
const dotenv = require('dotenv');
const { connect } = require('http2');
const e = require('express');
const cors = require('cors')
const {Server} = require('socket.io');
// const { socket } = require('./client/src/socket');

// import { fillUpdateForm } from './functions.js';

const db = mysql1.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Maheen123',
  database: 'shipping'
});

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Maheen123',
  database: 'shipping',
  connectionLimit: 10,
  connectTimeout: 10000,
});

async function connectDB() {
  try{
    return con = await db
  }
  catch(err){
    console.log(err)
  }
}

var hostname = "kw6.h.filess.io";

var database = "Shipping_poormiceno";

var port = "3307";

var username = "Shipping_poormiceno";

var password = "a0146b208178e380e170521e5d4729d9d6c5f49d";

// var db = mysql.createConnection({

//   host: hostname,

//   user: username,

//   password,

//   database,

//   port,

// });


db.connect((err)=>{
  if (err) throw err;
  console.log('Database connected.');
});

dotenv.config()

var jsonParser = bodyParser.json()

const verifyToken = verifyTokens.verifyToken

const verifyToken2 = verifyTokens.verifyToken2

const decodedToken = verifyTokens.decodedToken

const app = express();

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'shipping', 'build')))
app.use(express.static(__dirname));
// app.use(express.static(path.join(__dirname, 'Checkout')));
app.use(cookieParser())
// app.use(cors())
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))

const io = new Server(app.listen(process.env.PORT, ()=>{console.log("Listening.")}), {
  cors: {
    origin: "http://localhost:3000"
  }
})

let count = 0

io.of('/orders').on('connection', (socket)=>{
  console.log('User ' +count+' Connected.')
  // io.emit('newOrder')
})

io.on('disconnect', (socket) => {
  console.log('User Disconnected.')
})