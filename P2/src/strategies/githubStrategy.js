const GitHubStrategy = require('passport-github2').Strategy

module.exports = new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback",
    scope: ['user:email'],
    session: false 
},
    function (accessToken, refreshToken, profile, done) {
        // Take only email from the github response
        const email = profile.emails[0].value

        return done(null, profile)
    }
);