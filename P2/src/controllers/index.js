const router = require('express').Router();
const passport = require('passport')
const fortune_teller = require('fortune-teller')
const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../strategies/jwtStrategy')

// GET /login
router.get('/login', (req, res) => {
    res.sendFile('login.html', { root: './src/public' })
})

// POST /login
router.post(
    "/login",
    passport.authenticate("username-password", {
        failureRedirect: "/login",
        session: false,
    }),
    (req, res) => {
        // send jwt
        const jwtclaims = {
            sub: req.user.username,
            iss: 'localhost:3000',
            aud: 'localhost:3000',
            exp: Math.floor(Date.now() / 1000) + 604800, // 1 week (7×24×60×60=604800s) from now
            role: 'user' // just to show a private jwt field
        }

        const token = jwt.sign(jwtclaims, jwtSecret)

        res.cookie('jwt', token, { httponly: true, secure: true })

        // redirect to /
        res.redirect("/")

        // debug info
        console.log(`token sent. debug at https://jwt.io/?value=${token}`)
        console.log(`token secret (for verifying the signature): ${jwtSecret.toString('base64')}`)
    }
)

// GET /
router.get(
    '/',
    passport.authenticate("jwt", {
        failureRedirect: "/login",
        session: false
    }),
    function (req, res) {
        const fortune = fortune_teller.fortune()
        res.send(`
        <html>
            <head>
                <title>Fortune Teller</title>
            </head>
            <body>
                <h1>Fortune Teller</h1>
                <p>(${req.user}) fortune teller says: <br> ${fortune}</p>
                <a href="/logout">Logout</a>
            </body>
        </html>
        `)

    }
)

// GET /logout
router.get(
    '/logout',
    passport.authenticate("jwt", {
        failureredirect: "/login",
        session: false
    }),
    function (req, res) {
        res.clearCookie('jwt')
        res.redirect('/')
    }
)

module.exports = router;