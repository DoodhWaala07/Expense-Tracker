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
const serverless = require('serverless-http');
// const { socket } = require('./client/src/socket');

// import { fillUpdateForm } from './functions.js';

// var hostname = "ia0.h.filess.io";

// var database = "Expenses_pinkpuredo";

// var port = "3307";

// var username = "Expenses_pinkpuredo";

// var password = "81065691c785a163250f42f5d8c695981295004b";

var hostname = 'test-mysql-test07.a.aivencloud.com';

var database = 'expense';

var port = '13552';

var username = 'avnadmin';

var password = 'AVNS_JCwKfM806pmWv5gTcnO';

// var db = mysql1.createConnection({

//   host: hostname,

//   user: username,

//   password,

//   database,

//   port,

// });

const pool = mysql.createPool({
  host: hostname,
  user: username,
  password,
  database,
  port,
});


// const db = mysql1.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'Maheen123',
//   database: 'expenses'
// });

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: 'Maheen123',
//   database: 'expenses',
//   connectionLimit: 10,
//   connectTimeout: 10000,
// });

async function connectDB() {
  try{
    return con = await db
  }
  catch(err){
    console.log(err)
  }
}



// db.connect((err)=>{
//   if (err) throw err;
//   console.log('Database connected.');
// });

dotenv.config()

var jsonParser = bodyParser.json()

// const verifyToken = verifyTokens.verifyToken

// const verifyToken2 = verifyTokens.verifyToken2

// const decodedToken = verifyTokens.decodedToken

const app = express();

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '..', 'expense', 'build')))

console.log(path.join(__dirname, '..', 'expense', 'build'))
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

module.exports.handler = serverless(app);

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
  // console.log(page)
  try{
    con = await pool.getConnection()
    let sql = 'SELECT * FROM category ' + whereClause + ' LIMIT ? OFFSET ? '
    console.log(sql)
    // let sql = 'SELECT * FROM category ' + whereClause

    let result = await con.query(sql, sqlParams)
    // console.log(result[0])
    res.send(result[0])
  } catch(err){
    console.log(err)
  } finally{
    if(con){
      con.release()
    }
  }
})

app.get('/subcategory', jsonParser, async (req, res) => {
  console.log('GET SUBCATEGORY')
  let {input, type, page, limit, metadata} = req.query
  console.log(metadata)
  let catId = metadata.ID || ''
  input ? whereClause = 'AND Name LIKE ? ' : whereClause = ''
  limit = limit || 10
  let offset = (parseInt(page) - 1) * 10
  let sqlParams = [catId]

  sqlParams = input ? [...sqlParams, `%${input}%`, limit, offset] : [...sqlParams, limit, offset]

  let sql = 'SELECT * FROM sub_category WHERE Category = ? ' + whereClause + 'LIMIT ? OFFSET ?'

  let con
  try{
    con = await pool.getConnection()
    let result = await con.query(sql, sqlParams)
    // console.log(result[0])
    res.send(result[0])
  } catch(err){
    console.log(err)
  } finally{
    if(con){
      con.release()
    }
  }
})

app.post('/subcategory', jsonParser, async (req, res) => {
  let {category, subcategory} = req.body
  let catId = category.ID
  let duplicateSub

  let sql = 'INSERT INTO sub_category (Name, Category) VALUES (?, ?)'

  let con

  try{
    con = await pool.getConnection()
    for(const sub of subcategory){
      try{
        await con.query(sql, [sub, catId])
      }
      catch(err){
        console.log(err)
        if(err.code === 'ER_DUP_ENTRY'){
          // res.status(409).send('Sub-Category ' + sub + ' already exists.')
          duplicateSub = sub
        }
          throw err
      }
    }
    // await con.query(sql, [subcategory, catId])
    res.status(200).send('Sub-Category created successfully.')

    await con.commit()
  } catch(err){
    if(con){
      con.rollback()
    }
    // console.log(err)
    if(err.code === 'ER_DUP_ENTRY'){
        res.status(409).send('Sub-Category ' + duplicateSub + ' already exists.')
    } else {
      res.status(409).send('Failed to create sub-category.')
    }
  } finally{
    if(con){
      con.release()
    }
  }
})

app.post('/expenses', jsonParser, async (req, res) => {
  console.log(req.body)
  let expenses = req.body.rows
  let globalFields = req.body.globalFields
  let error
  let sql = 'INSERT INTO expenses SET ?'
  let con

  try{
    con = await pool.getConnection()

    await con.beginTransaction()

    //Start submitting transaction data
    let sqlTransaction = 'INSERT INTO transactions SET ?'

    let result = await con.query(sqlTransaction, globalFields)
    // console.log(result[0])
    let transId = result[0].insertId

    expenses = expenses.map(expense => {
      return {...expense, Transaction: transId}
    })
    //Start adding expense
    for(const expense of expenses){
      try{
        await con.query(sql, expense)
      } catch(err){
        error = err
        // console.log(err)
        throw new Error(err)
      }
    }
    con.commit()
    res.status(200).send('Expenses added successfully.')
  } catch(err){
    if(con){
      con.rollback()
    }
    console.log(err)
    // throw new Error('Failed to add expenses.')
    let error = err
    res.status(409).send(error.message)
  } finally{
    if(con){
      con.release()
    }
  }
})


// app.get('*', (req,res) => {
//   res.sendFile(path.join(__dirname,'../expense/build/index.html'));
// })

// app.get('/route', (req, res) => {
//   res.sendFile(path.join(__dirname, '../expense/build/index.html'));
// });

// app.get('*', (req, res) => {
//   res.redirect('/route');
// });