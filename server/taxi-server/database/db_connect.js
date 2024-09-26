const db=require('mysql')

const conn = db.createConnection({
    host: 'localhost',
    port: 3308,
    user: 'taxi',
    password : 'taxi',
    database : 'taxi'
})

module.exports = conn