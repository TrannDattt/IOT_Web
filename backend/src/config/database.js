const { rejects } = require('assert')
const { query } = require('express')
const mysql = require('mysql2')

class Database {
    constructor() {
        this.connection = mysql.createConnection({
            host: 'localhost',
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        })

        this.connection.connect(err => {
            if(err){
                console.log('Database connection error: ', err)
                return
            }

            console.log('Connect successfully')
        })
    }

    query(sql, params) {
        return new Promise((resolve, rejects) => {
            this.connection.query(sql, params, (err, result) => {
                if(err)
                    rejects(err)
                else
                    resolve(result)
            })
        })
    }
}

module.exports = new Database()