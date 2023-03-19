const LocalStrategy = require('passport-local').Strategy

const USER = "walrus"
const PASSWORD = "walrus"

module.exports = new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password',
        session: false,
    },
    function (username, password, done) {
        if (username === USER && password === PASSWORD) {
            return done(null, {
                username: 'walrus',
                description: "the only that desevers to contact the fortune teller"
            })
        }
        return done(null, false, { message: 'Incorrect username or password.' })
    }
)
