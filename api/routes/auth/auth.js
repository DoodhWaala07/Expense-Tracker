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
const nodemailer = require('nodemailer');
const pool = require('../../database/pool');
const crypto = require('crypto');

dotenv.config();

const rtr = express.Router();

var jsonParser = bodyParser.json()

let transporter = nodemailer.createTransport({
    service: 'gmail',  // You can use another service like Outlook, Yahoo, etc.
    auth: {
        user: 'managemyexpenses2024@gmail.com', // Your email
        pass: process.env.EMAIL_PASSWORD,  // Your email password (use app-specific password for Gmail)
    },
    promise: true
});

const generateOTP = () => {
    const otp = crypto.randomInt(100000, 999999); // Generates a number between 100000 and 999999
    return otp.toString();
};


// rtr.post('/signup', jsonParser, async (req, res) => {
//     console.log('SIGN UP')
//     let {Username, Email, Password} = req.body
//     console.log(req.body)
//     let status = 'Unverified'

//     console.log(process.env.EMAIL_PASSWORD)

//     let con 

//     try {
//         con = await pool.getConnection()
//         await con.beginTransaction()

//         let salt = await bcrypt.genSalt(10)
//         let hashedPassword = await bcrypt.hash(Password, salt)    

//         let sql = 'INSERT INTO Users (Username, Email, Password, Status) VALUES (?, ?, ?, ?)'

//         let result = await con.query(sql, [Username, Email, hashedPassword, status])

//         let userId = result[0].insertId

//         let otp = generateOTP()

//         sql = 'REPLACE INTO otps (User, OTP) VALUES (?, ?)'
//         await con.query(sql, [userId, otp])

//         let mailOptions = {
//             from: 'no-reply@managemyexpenses.com',
//             to: Email,
//             subject: 'Welcome to ManageMyExpenses',
//             text: `Hello ${Username}! Welcome to ManageMyExpenses. Your OTP is ${otp}.`,
//         };

//         // transporter.sendMail(mailOptions, function(error, info){
//         //     if(error){
//         //         console.log(error)
//         //         throw new Error({code: 'EMAIL_ERROR', message: error})
//         //     }
//         // })
//         const info = await transporter.sendMail(mailOptions);

//         await con.commit()

//         res.status(200).send('Email sent.')
//         // let salt = await bcrypt.genSalt(10)
//     } catch (error){
//         if(con) con.rollback()
//         if(error.code === 'ER_DUP_ENTRY') return res.status(409).send('Email already exists')
//         console.log(error)
//         return res.status(500).send('Server Error. Please try again later')
//     } finally{
//         if(con) con.release()
//     }
// })

rtr.post('/signup', jsonParser, async (req, res) => {
    console.log('SIGN UP')
    let {Username, Email, Password} = req.body
    console.log(req.body)
    let status

    console.log(process.env.EMAIL_PASSWORD)

    let con 

    try {
        con = await pool.getConnection()
        await con.beginTransaction()

        let salt = await bcrypt.genSalt(10)
        let hashedPassword = await bcrypt.hash(Password, salt)    

        let sql = 'INSERT INTO users_temp (Username, Email, Password) VALUES (?, ?, ?)'

        let result = await con.query(sql, [Username, Email, hashedPassword])

        let userId = result[0].insertId

        let otp = generateOTP()

        sql = 'REPLACE INTO signup_otps (User, OTP) VALUES (?, ?)'
        await con.query(sql, [userId, otp])

        let mailOptions = {
            from: 'no-reply@managemyexpenses.com',
            to: Email,
            subject: 'Welcome to ManageMyExpenses',
            text: `Hello ${Username}! Welcome to ManageMyExpenses. Your OTP is ${otp}.`,
        };

        // transporter.sendMail(mailOptions, function(error, info){
        //     if(error){
        //         console.log(error)
        //         throw new Error({code: 'EMAIL_ERROR', message: error})
        //     }
        // })
        const info = await transporter.sendMail(mailOptions);

        await con.commit()

        res.status(200).send({userId: userId})
        // let salt = await bcrypt.genSalt(10)
    } catch (error){
        if(con) con.rollback()
        if(error.code === 'ER_DUP_ENTRY') return res.status(409).send('Email already exists')
        console.log(error)
        return res.status(500).send('Server Error. Please try again later')
    } finally{
        if(con) con.release()
    }
})

rtr.post('/signin', jsonParser, async (req, res) => {
    // let {username, email, password} = req.body
    console.log('AUTH')
    console.log(req.body)
    // console.log(username, email, password)
  })

rtr.get('/checkUsername', async (req, res) => {
    console.log('CHECK USERNAME')
    console.log(req.query)
    let {username} = req.query
    console.log(username)
    let sql = 'SELECT * FROM Users WHERE Username = ?'

    let con

    try {
        con = await pool.getConnection()
        let result = await con.query(sql, [req.query.username])
        res.send(result[0])
} catch (error) {
    console.log(error)
    res.status(500).json({message: 'Server Error'})
} finally {
    if(con) con.release()
}
})

// rtr.post('/checkOTP', jsonParser, async (req, res) => {
//     console.log('CHECK OTP')
//     let {Email, OTP} = req.body
//     let sql = 'SELECT * FROM otps WHERE OTP = ? AND User IN (SELECT ID FROM Users WHERE Email = ?)'

//     let con
//     try {
//         con = await pool.getConnection()
//         await con.beginTransaction()

//         let result = await con.query(sql, [OTP, Email])

//         if(result[0].length > 0){
//             await con.query('UPDATE Users SET Status = "Active" WHERE Email = ?', [Email])
//         } else {
//             console.log('ERRRRRRRR')
//             const error = new Error('Invalid OTP')
//             error.code = 'ER_NO_MATCH'
//             throw error
//         }
//         await con.commit()

//         res.status(200).send('Email verified.')

//     } catch (err) {
//         if(con) con.rollback()
//         console.log(err.code)
//         if(err.code === 'ER_NO_MATCH') return res.status(404).send('Invalid OTP')
        
//         res.status(500).send('Server Error. Please try again later.')
//     } finally {
//         if(con) con.release()
//     }
// })

rtr.post('/checkSignUpOTP', jsonParser, async (req, res) => {
    console.log('CHECK OTP')
    let {Email, OTP, userId} = req.body
    console.log(Email, OTP, userId)
    let sql = 'SELECT * FROM signup_otps WHERE OTP = ? AND User = ?'

    let con
    try {
        con = await pool.getConnection()
        await con.beginTransaction()

        let result = await con.query(sql, [OTP, userId])
        console.log(result[0])

        if(result[0].length > 0){
            sql = 'INSERT INTO Users (Username, Email, Password, Status) SELECT Username, Email, Password, "Active" FROM Users_temp WHERE ID = ?'

            await con.query(sql, [userId])

            await con.query(`DELETE FROM signup_otps WHERE User = ?`, [userId])

            await con.query('DELETE FROM Users_temp WHERE ID = ?', [userId])


            // await con.query('UPDATE Users SET Status = "Active" WHERE Email = ?', [Email])
        } else {
            console.log('ERRRRRRRR')
            const error = new Error('Invalid OTP')
            error.code = 'ER_NO_MATCH'
            throw error
        }
        await con.commit()

        res.status(200).send('Email verified.')

    } catch (err) {
        if(con) con.rollback()
        console.log(err)
        if(err.code === 'ER_NO_MATCH') return res.status(404).send('Invalid OTP')
        
        res.status(500).send('Server Error. Please try again later.')
    } finally {
        if(con) con.release()
    }
})

module.exports = rtr
