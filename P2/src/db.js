// Create a new database connection sqlite
const sqlite3 = require('sqlite3').verbose();
const argon2 = require('argon2')

// Constants
const USER = "walrus"
const PASSWORD = "walrus"

// open the database
let db = new sqlite3.Database('users.db');

async function initUserTable() {
    // Init user hashes table
    const TIME_COST = 3

    const hashWalrus = await argon2.hash(PASSWORD, {
        timeCost: TIME_COST,
    })

    db.run('INSERT OR REPLACE INTO users (username, password) VALUES (?, ?)', [USER, hashWalrus], function (err) {
        if (err) {
            return console.log(err.message);
        }
    });
    console.log(`[*] Created walrus hash with cost factor ${TIME_COST}`)
}

// export the database
module.exports = {
    db,
    initUserTable
}
