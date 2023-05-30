const GoogleStrategy = require('passport-google-oidc');

module.exports = new GoogleStrategy({
    clientID: process.env.OIDC_CLIENT_ID,
    clientSecret: process.env.OIDC_CLIENT_SECRET,
    callbackURL: process.env.OIDC_CALLBACK_URL,
  },
  function verify(issuer, profile, cb) {
    const email = profile.emails[0].value
    return cb(null, profile);
  }
);