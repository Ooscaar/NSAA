// Before importing strategies
const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const logger = require("morgan")
const passport = require('passport')
const cookieParser = require('cookie-parser')
const localStrategy = require("./strategies/passwordStrategy")
const { jwtStrategy } = require("./strategies/jwtStrategy")
const githubStrategy = require("./strategies/githubStrategy")
const googleStrategy = require("./strategies/googleStrategy")
const controllers = require("./controllers")
const session = require('express-session')
const { initUserTable } = require('./db')

async function main() {

    const app = express()

    // Init user table
    initUserTable()

    // Serialize
    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (obj, done) {
        done(null, obj);
    });

    // #### Middlewares ####
    app.use(logger('dev'))
    app.use(cookieParser())

    // #### Passport strategies ####
    passport.use("username-password", localStrategy)
    passport.use("jwt", jwtStrategy)
    passport.use("github", githubStrategy)
    passport.use("google", googleStrategy)

    app.use(express.urlencoded({ extended: false }))
    app.use(passport.initialize())

    // #### Session used by openid-client ####
    app.use(session({
         secret: 'super secret', 
         resave: false,
          saveUninitialized: false,
        })
    )

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
}

main().catch(e => { console.log(e) })