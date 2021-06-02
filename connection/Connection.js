const mysql = require("mysql")

// Connection
const db = mysql.createConnection({
    user: "root",
    password: "Bacamanga1",
    database: "joshua_aditama",
    port: 3306
})

module.exports = db