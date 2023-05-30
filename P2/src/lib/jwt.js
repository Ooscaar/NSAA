const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../strategies/jwtStrategy')

// Allow only to modify the subject filed
function createJwtToken({sub}) {
    const jwtClaims = {
        sub: sub,
        iss: 'localhost:3000',
        aud: 'localhost:3000',
        exp: Math.floor(Date.now() / 1000) + 604800, // 1 week (7×24×60×60=604800s) from now
        role: 'user', // just to show a private jwt field
        exam: "Pérez Castillo"
    }
    const token = jwt.sign(jwtClaims, jwtSecret)

    return token;
}

module.exports = {
    createJwtToken  
}