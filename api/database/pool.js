var hostname = 'test-mysql-test07.a.aivencloud.com';

var database = 'expense';

var port = '13552';

var username = 'avnadmin';

var password = DB_PASSWORD;

const mysql = require('mysql2/promise');

// const hostname = 'localhost';
// const username = 'root';
// const password = 'Maheen123';
// const database = 'expenses';
// const port = '3306';
const connectionLimit = 10;
const connectTimeout = 10000;


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
  password: password,
  database: database,
  port:port,
  connectionLimit: connectionLimit,
  connectTimeout: connectTimeout
});

module.exports = pool