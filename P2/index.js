const express = require('express')
const logger = require("morgan")
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const app = express()

// Logger
app.use(logger('dev'))

// #### Passport ####
passport.use(
    "username-password",
    new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        session: false,
    },
        function (username, password, done) {
            if (username === 'walrus' && password === 'walrus') {
                return done(null, {
                    username: 'walrus',
                    description: "the only that desevers to contact the fortune teller"
                })
            }
            return done(null, false, { message: 'Incorrect username or password.' })
        }
    ))
app.use(express.urlencoded({ extended: false }))
app.use(passport.initialize())

// Error handler
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

// GET Login
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html')
})

// POST Login
app.post(
    "/login",
    passport.authenticate("username-password", {
        failureRedirect: "/login",
        session: false,
    }),
    (req, res) => {
        res.send(`Hello ${req.user.username}`)
    }
)

app.get('/', (req, res) => {
    res.send('hello world')
})

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})