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
// const verifyTokens = require('./authorization')
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
  database: 'expenses'
});

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Maheen123',
  database: 'expenses',
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

// const verifyToken = verifyTokens.verifyToken

// const verifyToken2 = verifyTokens.verifyToken2

// const decodedToken = verifyTokens.decodedToken

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

app.post('/category', jsonParser, async (req, res) => {
  let con
  let {category, subCategories} = req.body
  console.log(category, subCategories)
  let sql = 'INSERT INTO category (Name) VALUES (?)'
  let catId

  try{
    con = await pool.getConnection()
    con.beginTransaction()

    try{
      result = await con.query(sql, category)
      catId = result[0].insertId
    } catch(err){
      if(err.code === 'ER_DUP_ENTRY'){
        res.status(409).send('Category already exists.')
      }
      throw new Error('Failed to create category.')
    }

      for (const subCat of subCategories) {
        console.log(subCat)
        sql = 'INSERT INTO sub_category (Name, Category) VALUES (?, ?)';
        try {
          await con.query(sql, [subCat, catId]);
        } catch (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            res.status(409).send('Sub-Category ' + subCat + ' already exists.');
          }
          throw new Error('Failed to create sub-categories.');
        }
      }
    await con.commit()
    res.status(200).send('Category created successfully.');
  }
  catch(err){
    console.log(err)
    if(con){
      con.rollback()
    }
  }
  finally{
    con.release()
  }
  console.log('Helloooo')

  // console.log(req.body)
})

app.get('/category', jsonParser, async (req, res) => {
  console.log('GET CATEGORY')
  let {input, type, page, limit} = req.query
  input ? whereClause = 'WHERE Name LIKE ?' : whereClause = ''
  limit = limit || 10
  let offset = (parseInt(page) - 1) * 10

  let sqlParams = []
  input ? sqlParams.push(`%${input}%`) : null

  sqlParams = [...sqlParams, limit, offset]

  let con
  console.log(page)
  try{
    con = await pool.getConnection()
    let sql = 'SELECT * FROM category ' + whereClause + ' LIMIT ? OFFSET ? '
    console.log(sql)
    // let sql = 'SELECT * FROM category ' + whereClause

    let result = await con.query(sql, sqlParams)
    console.log(result[0])
    res.send(result[0])
  } catch(err){
    console.log(err)
  } finally{
    if(con){
      con.release()
    }
  }
})  