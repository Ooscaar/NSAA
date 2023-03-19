const express = require('express')
const logger = require("morgan")
const jwt = require('jsonwebtoken')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const app = express()

// Don't do it in production
const jwtSecret = require('crypto').randomBytes(16)

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
        // Send jwt
        const jwtClaims = {
            sub: req.user.username,
            iss: 'localhost:3000',
            aud: 'localhost:3000',
            exp: Math.floor(Date.now() / 1000) + 604800, // 1 week (7×24×60×60=604800s) from now
            role: 'user' // just to show a private JWT field
        }

        const token = jwt.sign(jwtClaims, jwtSecret)

        res.json(token)

        // Debug info
        console.log(`Token sent. Debug at https://jwt.io/?value=${token}`)
        console.log(`Token secret (for verifying the signature): ${jwtSecret.toString('base64')}`)
    }
)

app.get('/', (req, res) => {
    res.send('hello world')
})

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})