const router = require('express').Router();
const passport = require('passport')
const fortune_teller = require('fortune-teller')
const { createJwtToken } = require('../lib/jwt')
const { jwtSecret } = require("../strategies/jwtStrategy")

// ***********************************************************
// LOGIN ENDPOINTS
// ***********************************************************

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
        const token = createJwtToken({
            sub: req.user.username
        })
        res.cookie('jwt', token, { httponly: true, secure: true })

        // redirect to /
        res.redirect("/")

        // debug info
        console.log(`token sent. debug at https://jwt.io/?value=${token}`)
        console.log(`token secret (for verifying the signature): ${jwtSecret.toString('base64')}`)
    }
)

// GET /logout
router.get(
    '/logout',
    function (req, res) {
        res.clearCookie('jwt')
        res.redirect('/login')
    }
)

// ***********************************************************
// ENTRY POINT
// ***********************************************************

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
        <style>
            body {
                font-family: Arial, Helvetica, sans-serif;
            }
        </style>

            <head>
                <title>Fortune Teller</title>
            </head>
            <body>
                <h1>Fortune Teller</h1>
                <p>Fortune teller says: <br> ${fortune}</p>
                <a href="/logout">Logout</a>
            </body>
        </html>
        `)

    }
)


// ***********************************************************
// GITHUB AUTH ENDPOINTS
// ***********************************************************
router.get('/auth/error', (req, res) => res.send('Unknown Error'))
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get(
    '/auth/github/callback',
    passport.authenticate('github', {
        failureRedirect: '/auth/error',
        session: false                      // IMPORTANT
    }),
    function (req, res) {
        const email = req.user.emails[0].value;
        const token = createJwtToken({
            sub: email
        })
        res.cookie('jwt', token, { httponly: true, secure: true })
        res.redirect('/');

        console.log(`token sent. debug at https://jwt.io/?value=${token}`)
        console.log(`token secret (for verifying the signature): ${jwtSecret.toString('base64')}`)
    }
);
// ***********************************************************

// ***********************************************************
// GOOGLE AUTH ENDPOINTS
// ***********************************************************
router.get(
    '/auth/google',
    passport.authenticate('google', { session: false, scope: ['openid', 'email', 'profile'] }),
)
router.get(
    '/oidc/cb',
    passport.authenticate('google', {
        failureRedirect: '/auth/error',
        session: false,
    }),
    function (req, res) {
        const email = req.user.emails[0].value;
        const token = createJwtToken({
            sub: email
        })
        res.cookie('jwt', token, { httponly: true, secure: true })
        res.redirect('/');

        console.log(`token sent. debug at https://jwt.io/?value=${token}`)
        console.log(`token secret (for verifying the signature): ${jwtSecret.toString('base64')}`)
    }
);

module.exports = router;