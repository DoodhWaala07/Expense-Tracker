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
const authMiddleware = require('./authMiddleware');

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


rtr.post('/signup', jsonParser, async (req, res) => {
    console.log('SIGN UP')
    let {Username, Email, Password} = req.body
    console.log(req.body)
    let status

    let con

    try {
        con = await pool.getConnection()
        await con.beginTransaction()

        let sql = 'SELECT * FROM users WHERE Email = ?'

        let emailCheck = await con.query(sql, [Email])

        if(emailCheck[0].length > 0){
            let error = new Error({code: 'ER_DUP_ENTRY', message: 'Email already exists.'})
            error.code = 'ER_DUP_ENTRY'
            throw error
        }

        let salt = await bcrypt.genSalt(10)
        let hashedPassword = await bcrypt.hash(Password, salt)   

        sql = 'INSERT INTO users_temp (Username, Email, Password) VALUES (?, ?, ?)'

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
});

rtr.post('/signin', jsonParser, async (req, res) => {
    let {Username, Password, staySignedIn} = req.body
    console.log('SIGN IN')
    console.log(Username, Password)

    let sql = 'SELECT * FROM users WHERE Username = ?'

    let con 

    try {
        con = await pool.getConnection()
        let [[result]] = await con.query(sql, [Username])
        console.log(result)
        if(result && bcrypt.compareSync(Password, result.Password)){
            const token = jwt.sign({id: result.ID, username: result.Username}, process.env.JWT_SECRET);
            res.cookie('token', token, {
                httpOnly: true,  // Ensures the cookie is only sent in HTTP requests, not accessible via JavaScript
                secure: process.env.NODE_ENV === 'production',  // Set secure only in production (HTTPS)
                // domain: process.env.NODE_ENV === 'production' ? '.netlify.app' : 'localhost',
                // domain: undefined,
                path: '/',
                sameSite: 'Strict',  // Helps prevent CSRF attacks
                maxAge: staySignedIn ? 3600000 * 24 * 365 * 10 : null // 1 hour in milliseconds
            });
    
            res.status(200).send(result)
        } else {
            let error = new Error('Invalid credentials')
            error.code = 'INVALID_CREDENTIALS'
            throw error
        }
    } catch (error) {
        console.log(error)
        if(error.code === 'INVALID_CREDENTIALS') return res.status(401).send('Invalid credentials')
        res.status(500).json({message: 'Server Error'})
    } finally {
        if(con) con.release()
    }
  });

rtr.post('/signout', (req, res) => {
    console.log('SIGN OUT')
    try{
        // res.clearCookie('token', {secure: true, sameSite: 'none'})
        res.cookie('token',  '',{
            expires: new Date(0),
            httpOnly: true,  // Ensures the cookie is only sent in HTTP requests, not accessible via JavaScript
            // domain: process.env.NODE_ENV === 'production' ? '.netlify.app' : 'localhost',
            // domain: undefined,
            path: '/',
            secure: process.env.NODE_ENV === 'production',  // Set secure only in production (HTTPS)
            sameSite: 'Strict',  // Helps prevent CSRF attacks
        });
        res.status(200).send('Signout successful')
    } catch(err){
        console.log(err)
        res.status(500).json({message: 'Server Error'})
    }
});

rtr.get('/checkUsername', async (req, res) => {
    console.log('CHECK USERNAME')
    console.log(req.query)
    let {username} = req.query
    console.log(username)
    let sql = 'SELECT * FROM users WHERE Username = ?'

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
});

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
            sql = "INSERT INTO users (Username, Email, Password, Status) SELECT Username, Email, Password, 'Active' FROM users_temp WHERE ID = ?"

            await con.query(sql, [userId])

            await con.query(`DELETE FROM signup_otps WHERE User = ?`, [userId])

            await con.query('DELETE FROM users_temp WHERE ID = ?', [userId])


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
});

rtr.post('/forgotPassword', jsonParser, async (req, res) => {
    let {Email} = req.body
    let sql = 'SELECT * FROM users WHERE Email = ?'

    let con

    try {
        con = await pool.getConnection()

        await con.beginTransaction()
        let [[user]] = await con.query(sql, [Email])
        if(user){
            let token = jwt.sign({id: user.ID, email: user.Email, username: user.Username}, process.env.JWT_SECRET, {expiresIn: '5m'})
            let domain = process.env.NODE_ENV === 'production' ? 'managemyexpenses.netlify.app' : 'localhost:3000'
            let mailOptions = {
                from: 'managemyexpenses <nGq9A@example.com>',
                to: user.Email,
                subject: 'Password Reset Request',
                html: `
                <h1>Reset Password</h1>
                <p>Click the link below to reset your password</p>
                <a href="http://${domain}/resetPassword/${token}">Reset Password</a>`
            }

            await con.query('REPLACE INTO reset_password_requests (User) VALUES (?)', [user.ID])
            const info = await transporter.sendMail(mailOptions);
            await con.commit()
            res.status(200).send('Password reset link sent to ' + user.Email)

        } else {
            if(con) con.rollback()
            const error = new Error('User not found')
            error.code = 'ER_NO_MATCH'
            throw error
        }
    } catch (err) {
        console.log(err)
        if(err.code === 'ER_NO_MATCH') return res.status(404).send('User not found')
        res.status(500).send('Server Error. Please try again later.')
    } finally {
        if(con) con.release()
    }
});

rtr.post('/resetPassword', jsonParser, async (req, res) => {
    let {token, Password} = req.body
    let con = await pool.getConnection()
    try{
        let user = jwt.verify(token, process.env.JWT_SECRET)
        let resetReq = await con.query('SELECT * FROM reset_password_requests WHERE User = ?', [user.id])

        if(resetReq[0].length > 0){
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(Password, salt)
            await con.query('UPDATE users SET Password = ? WHERE ID = ?', [hash, user.id])
            await con.query('DELETE FROM reset_password_requests WHERE User = ?', [user.id])
        } else {
            const error = new Error('Invalid token')
            error.code = 'ER_NO_MATCH'
            throw error
        }

        await con.commit()

        res.status(200).send('Password reset successful')
    } catch(err){
        console.log(err)
        if(err.code === 'ER_NO_MATCH' || err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError' || err.code === 'ERR_INVALID_SIGNATURE') return res.status(404).send('Invalid token')
        res.status(500).send('Server Error. Please try again later.')
    } finally {
        if(con) con.release()
    }
})

rtr.post('/checkResetToken', jsonParser,async (req, res) => {
    let {token} = req.body

    try{
        let user = jwt.verify(token, process.env.JWT_SECRET)
        res.status(200).send(user)
    } catch(err){
        console.log(err)
        if(err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError' || err.code === 'ERR_INVALID_SIGNATURE') return res.status(404).send('Invalid token')
        res.status(500).send('Server Error. Please try again later.')
    }
})

rtr.get('/checkToken', authMiddleware, async (req, res) => {
    res.status(200).send('Authorized')
})



module.exports = rtr
