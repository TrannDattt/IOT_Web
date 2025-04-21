const express = require('express')
const db = require('../config/database')
const moment = require('moment-timezone')

const router = express.Router()

router.get('/count-all-data', async (req, res) => {
    try {
        const [count] = await db.query('SELECT COUNT(*) as data_count FROM censor_data')

        return res.json({message: 'All censor data', count: count})
    } catch (error) {
        return res.status(500).json({message: 'Server error!', error})
    }
})

router.post('/add-one', async (req, res) => {
    const { temp, hum, lint } = req.body

    if(isNaN(temp) || isNaN(hum) || isNaN(lint)){
        return res.status(400).json({message: 'Invalid data.'})
    }

    try {
        const newData = await db.query('INSERT INTO censor_data (temp, hum, lint) VALUES (?, ?, ?)',
            [temp, hum, lint]
        )

        return res.json({message: 'Successfully added data.', data: newData})
    } catch (error) {
        return res.status(500).json({message: 'Server error.', error})
    }
})

router.get('/get-latest', async(req, res) => {
    const amount = parseInt(req.query.amount, 10) || 1 

    try {
        const rows = await db.query('SELECT * FROM censor_data ORDER BY time DESC LIMIT ?', [amount])

        const formattedData = rows.map(row => ({
            ...row,
            time: moment.utc(row.time).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss')
        }))

        return res.json({message: 'Successfully get latest data.', data: formattedData})
    } catch (error) {
        return res.status(500).json({message: 'Server error.', error})
    }
})

router.get('/get-table-data', async(req, res) => {
    const category = req.query.category || 'time'
    const value = req.query.value || ''
    const order = req.query.order || 'desc'
    const orderCat = req.query.orderCat || 'time'
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 6

    try {
        const rows = await db.query(`SELECT * FROM censor_data WHERE ${category} LIKE '${value}%'
            ORDER BY ${orderCat} ${order} LIMIT ? OFFSET ?`, [pageSize, (page - 1) * pageSize])

        const formattedData = rows.map(row => ({
            ...row,
            time: moment.utc(row.time).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss')
        }))

        return res.json({message: 'Successfully get latest data.', data: formattedData}) 
    } catch (error) {
        return res.status(500).json({message: 'Server error.', error})
    }
})

router.get('/count-all-data', async (req, res) => {
    try {
        const [count] = await db.query('SELECT COUNT(*) as data_count FROM censor_data')

        return res.json({message: 'All censor data', count: count})
    } catch (error) {
        return res.status(500).json({message: 'Server error!', error})
    }
})

router.get('/count-selected-data', async (req, res) => {
    const category = req.query.category || 'time'
    const value = req.query.value || ''

    try {
        const [count] = await db.query(`SELECT COUNT(*) AS data_count 
            FROM censor_data WHERE ${category} LIKE '${value}%'`
        )

        return res.json({message: `Count ${category} ${value} times.`, count: count})
    } catch (error) {
        return res.status(500).json({message: 'Server error!', error})
    }
})

module.exports = router