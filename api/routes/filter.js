const express = require('express');
const bodyParser = require('body-parser')
const authMiddleware = require('./auth/authMiddleware');

const rtr = express.Router();

const pool = require('../database/pool');

const jsonParser = bodyParser.json();

module.exports = rtr;


rtr.get('/subcategory', jsonParser, authMiddleware, async (req, res) => {
    console.log('GET FILTER SUBCATEGORY')
    let userId = req.user.id
    let {input, type, page, limit, metadata} = req.query
    console.log(metadata)
    // let catId = metadata.ID || ''
    catId = metadata.map(item => (item.ID))
    // input ? whereClause = 'AND Name LIKE ? ' : whereClause = ''
    let whereClause = ' WHERE User = ? AND Category IN (?) '
    input ? whereClause += ' AND Name LIKE ?' : null
    limit = limit || 10
    let offset = (parseInt(page) - 1) * 10
    let sqlParams = [userId, catId]
  
    sqlParams = input ? [...sqlParams, `%${input}%`, limit, offset] : [...sqlParams, limit, offset]
  
    let sql = 'SELECT * FROM sub_category' + whereClause + 'LIMIT ? OFFSET ?'
  
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
  
