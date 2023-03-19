const JWTStategy = require('passport-jwt').Strategy

// Don't do it in production
const jwtSecret = require('crypto').randomBytes(16)

const jwtStrategy = new JWTStategy(
    {
        jwtFromRequest: req => req.cookies.jwt,
        secretOrKey: jwtSecret,
        session: false,
    },
    function (jwt_payload, done) {
        return done(null, jwt_payload.sub)
    }
)

module.exports = {
    jwtSecret,
    jwtStrategy,
}