const express = require('express')
const logger = require("morgan")
const passport = require('passport')
const cookieParser = require('cookie-parser')
const localStrategy = require("./strategies/passwordStrategy")
const { jwtStrategy } = require("./strategies/jwtStrategy")
const controllers = require("./controllers")
const { initUserTable } = require('./db')

const app = express()

initUserTable()

// #### Middlewares ####
app.use(logger('dev'))
app.use(cookieParser())

// #### Passport strategies ####
passport.use("username-password", localStrategy)
passport.use("jwt", jwtStrategy)

app.use(express.urlencoded({ extended: false }))
app.use(passport.initialize())

// #### Error handler ####
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

// #### Routes ####
app.use('/', controllers)

// #### Server ####
const PORT = 3000
app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})