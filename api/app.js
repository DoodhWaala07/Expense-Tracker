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
const authRouter = require('./routes/auth/auth')
const filterRouter = require('./routes/filter')
const pool = require('./database/pool');
const authMiddleware = require('./routes/auth/authMiddleware');
// const { socket } = require('./client/src/socket');


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

//ROUTERS
app.use('/api/auth', authRouter)
app.use('/api/filter', filterRouter)

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

app.post('/api/category', authMiddleware, jsonParser, async (req, res) => {
  let userId = req.user.id
  let con
  let {category, subCategories} = req.body
  console.log(category, subCategories)
  let sql = 'INSERT INTO category (Name, User) VALUES (?, ?)'
  let catId

  try{
    con = await pool.getConnection()
    con.beginTransaction()

    try{
      result = await con.query(sql, [category, userId])
      catId = result[0].insertId
    } catch(err){
      if(err.code === 'ER_DUP_ENTRY'){
        res.status(409).send('Category already exists.')
      }
      throw new Error('Failed to create category.')
    }

      for (const subCat of subCategories) {
        console.log(subCat)
        sql = 'INSERT INTO sub_category (Name, Category, User) VALUES (?, ?, ?)';
        try {
          await con.query(sql, [subCat, catId, userId]);
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

app.get('/api/category', jsonParser, authMiddleware, async (req, res) => {
  console.log(req.user)
  let userId = req.user.id
  console.log('GET CATEGORY')
  let {input, type, page, limit} = req.query
  

  let whereClause = 'WHERE User = ?'
  input ? whereClause += ' AND Name LIKE ?' : null
  limit = limit || 10
  let offset = ((parseInt(page) || 1) - 1) * 10

  let sqlParams = [userId]
  input ? sqlParams.push(`%${input}%`) : null

  sqlParams = [...sqlParams, limit, offset]

  let con
  // console.log(page)
  try{
    con = await pool.getConnection()
    let sql = page ? 'SELECT * FROM category ' + whereClause + ' LIMIT ? OFFSET ? ' : 'SELECT ID, Name AS Category FROM category ' + whereClause

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

app.get('/api/subcategory', jsonParser, authMiddleware, async (req, res) => {
  console.log('GET SUBCATEGORY')
  let userId = req.user.id
  let {input, type, page, limit, metadata} = req.query
  console.log(metadata)
  let catId = metadata.ID || ''
  // input ? whereClause = 'AND Name LIKE ? ' : whereClause = ''
  let whereClause = ' WHERE User = ? AND Category = ? '
  input ? whereClause += ' AND Name LIKE ?' : null
  limit = limit || 10
  let offset = ((parseInt(page) || 1) - 1) * 10
  let sqlParams = [userId, catId]

  sqlParams = input ? [...sqlParams, `%${input}%`, limit, offset] : [...sqlParams, limit, offset]

  let sql = page ? 'SELECT * FROM sub_category' + whereClause + ' LIMIT ? OFFSET ? ' : 'SELECT ID, Name AS SubCategory FROM sub_category' + whereClause

  let con
  try{
    con = await pool.getConnection()
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

app.post('/api/subcategory', jsonParser, authMiddleware, async (req, res) => {
  let {category, subcategory} = req.body
  let userId = req.user.id
  let catId = category.ID
  let duplicateSub

  let sql = 'INSERT INTO sub_category (Name, Category, User) VALUES (?, ?, ?)'

  let con

  try{
    con = await pool.getConnection()
    for(const sub of subcategory){
      try{
        await con.query(sql, [sub, catId, userId])
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

app.post('/api/expenses', jsonParser, authMiddleware, async (req, res) => {
  console.log(req.body)
  let expenses = req.body.rows
  let globalFields = req.body.globalFields

  let userId = req.user.id

  globalFields.User = userId
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

app.get('/api/expenses', jsonParser, authMiddleware, async (req, res) => {
  console.log('GET EXPENSES')
  let {categoryFilters, dateFilters, subCatFilters, timeZone, timePeriod, specificDates, range, note} = req.query

  console.log(specificDates)

  categoryFilters = categoryFilters ? categoryFilters : []
  dateFilters = dateFilters ? dateFilters : []
  subCatFilters = subCatFilters ? subCatFilters : []

  let userId = req.user.id
  let whereParams = [userId]
  // console.log(categoryFilters)

  //BEGIN FILTERS
  let categoryFilterClause = ''
  categoryFilters = categoryFilters.map(cat => {
    return cat.ID
  })
  categoryFilterClause = categoryFilters.length ? ` AND expenses.Category IN (?)` : ''
  categoryFilters.length ? whereParams.push(categoryFilters) : null

  let subCatFilterClause = ''
  subCatFilters = subCatFilters.map(sub => {
    return sub.ID
  })
  subCatFilterClause = subCatFilters.length ? ` AND expenses.Sub_Category IN (?)` : ''
  subCatFilters.length ? whereParams.push(subCatFilters) : null
  
  let noteClause = ''
  note ? noteClause = ` AND (transactions.Note LIKE ? OR expenses.Note LIKE ?)` : null
  note ? whereParams.push(`%${note}%`, `%${note}%`) : null

  // timePeriod = 'last_day'
  
  let dateFilterClause = dateFilterSQL({filter: timePeriod, column: 'transactions.Date', timeZone, whereParams, specificDates: specificDates, range})

  let sql = `SELECT category.Name AS Category, sub_category.Name AS Sub_Category, expenses.Amount, transactions.Date, 
  expenses.Quantity, CONCAT(transactions.Note, ' ', expenses.Note) AS Description
  FROM expenses INNER JOIN transactions ON expenses.Transaction = transactions.ID 
  INNER JOIN category ON expenses.Category = category.ID
  INNER JOIN sub_category ON expenses.Sub_Category = sub_category.ID
  WHERE transactions.User = ?` + categoryFilterClause + subCatFilterClause + noteClause + dateFilterClause + ' ORDER BY Date DESC'

  let amtSql = `SELECT SUM(expenses.Amount) AS Total, category.Name FROM expenses
  INNER JOIN category ON category.ID = expenses.Category
  INNER JOIN transactions ON transactions.ID = expenses.Transaction
  WHERE transactions.User = ?` + categoryFilterClause + subCatFilterClause + noteClause + dateFilterClause + ` GROUP BY expenses.Category`

  let con
  try{
    con = await pool.getConnection()

    let sums = await con.query(amtSql, whereParams)
    let expenses = await con.query(sql, whereParams)

    // console.log(result[0])

    // res.send(result[0])

    console.log(sums[0])

    res.send({expenses: expenses[0], sums: sums[0]})

  } catch(err){
    console.log(err)
  } finally{
    if(con){
      con.release()
    }
  }
}
)


function dateFilterSQL({filter, date, column, timeZone, whereParams = [], specificDates = [], range}){
  let filterNames = [
    {ID: 'none', Name: ' '},
    {ID: 'curr_day', Name: 'Today'},
    {ID: 'last_day', Name: 'Yesterday'},
    {ID: 'curr_week', Name: 'This Week'},
    {ID: 'last_week', Name: 'Last Week'},
    {ID: 'curr_month', Name: 'This Month'},
    {ID: 'last_month', Name: 'Last Month'},
    {ID: 'curr_year', Name: 'This Year'},
    {ID: 'last_year', Name: 'Last Year'},
    {ID: 'specific', Name: 'Specific Dates'},
    {ID: 'range', Name: 'Range'},
  ]
  let sql = ''
  switch(filter) {
    case 'curr_day':
      sql = ` AND DATE(CONVERT_TZ(${column}, 'UTC', ?)) = DATE(CONVERT_TZ(NOW(), 'UTC', ?))`
      console.log(sql)
      whereParams.push(timeZone, timeZone)
      // sql = ` AND DATE(CONVERT_TZ(transactions.Date, 'UTC', 'Asia/Karachi')) = DATE(CONVERT_TZ('2024-09-18 22:00:00', 'UTC', 'Asia/Karachi'))`
      // allFilters.push(date)
      break;
    case 'last_day':
      sql = ` AND DATE(CONVERT_TZ(${column}, 'UTC', ?)) = DATE(CONVERT_TZ(NOW() - INTERVAL 1 DAY, 'UTC', ?))`
      whereParams.push(timeZone, timeZone)
      // allFilters.push(date)
      break;
    case 'curr_week':
      sql = ` AND YEARWEEK(CONVERT_TZ(${column}, 'UTC', ?), 1) = YEARWEEK(CONVERT_TZ(NOW(), 'UTC', ?), 1)`
      whereParams.push(timeZone, timeZone)
      break;
    case 'last_week':
      sql = ` AND YEARWEEK(CONVERT_TZ(${column}, 'UTC', ?), 1) = YEARWEEK(CONVERT_TZ(NOW() - INTERVAL 1 WEEK, 'UTC', ?), 1)`
      whereParams.push(timeZone, timeZone)
      break;
    case 'curr_month':
      sql = ` AND MONTH(CONVERT_TZ(${column}, 'UTC', ?)) = MONTH(CONVERT_TZ(NOW(), 'UTC', ?))`
      whereParams.push(timeZone, timeZone)
      break;
    case 'last_month':
      sql = ` AND MONTH(CONVERT_TZ(${column}, 'UTC', ?)) = MONTH(CONVERT_TZ(NOW() - INTERVAL 1 MONTH, 'UTC', ?))`
      whereParams.push(timeZone, timeZone)
      break;
    case 'curr_year':
      sql = ` AND YEAR(CONVERT_TZ(${column}, 'UTC', ?)) = YEAR(CONVERT_TZ(NOW(), 'UTC', ?))`
      whereParams.push(timeZone, timeZone)
      break;
    case 'last_year':
      sql = ` AND YEAR(CONVERT_TZ(${column}, 'UTC', ?)) = YEAR(CONVERT_TZ(NOW() - INTERVAL 1 YEAR, 'UTC', ?))`
      whereParams.push(timeZone, timeZone)
      break;
    case 'specific':
      if(specificDates.length){
      sql = ` AND DATE(CONVERT_TZ(${column}, 'UTC', ?)) IN (?)`
      whereParams.push(timeZone, specificDates)
      console.log(sql)
      }
      break;
    case 'range':
      if(range.from && range.to){
        sql = ` AND DATE(CONVERT_TZ(${column}, 'UTC', ?)) BETWEEN ? AND ?`
        whereParams.push(timeZone, range.from, range.to)
      }

      break;
    default:
      break;
  }
  return sql
}

function specificDatesSQL(specificDates){
  let sql = ''
  
}
