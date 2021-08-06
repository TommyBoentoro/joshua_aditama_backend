const mysql = require("mysql")

require(`dotenv`).config()
// Connection
const db = mysql.createConnection({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
})

module.exports = db