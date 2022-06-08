const knex = require('knex')

const db = knex.default({
    client: 'mysql2',
    connection:{
        user:'root',
        password: '',
        host: '127.0.0.1',
        port: 3306,
        database: "nodejs_post",
        timezone:'+00:00'
    }
})

module.exports = db;