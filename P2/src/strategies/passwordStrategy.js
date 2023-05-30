const LocalStrategy = require('passport-local').Strategy
const { db } = require('../db')
const argon2 = require("argon2")

module.exports = new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password',
        session: false,
    },
    function (username, password, done) {
        db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
            if (err) {
                console.log("User not registered")
                return done(null, "User not registered")
            }
            if (!row) {
                console.log("Incorrect username or password")
                return done(null, false, { message: 'Incorrect username or password.' })
            }

            const { password: hashPassword } = row

            // Check with argon password
            argon2.verify(hashPassword, password).then((match) => {
                if (match) {
                    return done(null, {
                        username: row.username,
                        description: "the only that desevers to contact the fortune teller"
                    })
                }
                return done(null, false, { message: 'Incorrect username or password.' })
            })
        })
    }
)