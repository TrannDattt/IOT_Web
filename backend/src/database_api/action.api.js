const express = require('express')
const db = require('../config/database')
const moment = require('moment-timezone')

const router = express.Router()

router.post('/add-one', async (req, res) => {
    const { device, action } = req.body

    if(action !== 'ON' && action !== 'OFF'){
        return res.status(400).json({message: 'Invalid action.'})
    }

    try {
        const newAction = await db.query('INSERT INTO actions (device, action) VALUES (?, ?)',
            [device, action]
        )
        return res.json({message: 'Successfully added data.', data: newAction})
    } catch (error) {
        return res.status(500).json({message: 'Server error!', error})
    }
})

router.get('/get-latest', async (req, res) => {
    const deviceName = req.query.device || ''
    const sql = deviceName !== '' ? 'WHERE device = ?' : ''

    try {
        const latestAction = await db.query(`SELECT * FROM actions ${sql} ORDER BY time DESC LIMIT 1`, [deviceName])
        
        if(latestAction.length === 0){
            return res.json({message: 'Invalid device.'})
        }

        const action = latestAction[0]
        const formattedData = {
            ...action,
            time: moment.utc(latestAction.time).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss')
        }

        return res.json({message: 'Successfully get latest data.', data: formattedData})
    } catch (error) {
        return res.status(500).json({message: 'Server error!', error})
    }
})

router.get('/get-table-data', async(req, res) => {
    const value = req.query.value || ''
    const order = req.query.order || 'desc'
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 6

    try {
        const rows = await db.query(`SELECT * FROM actions WHERE time LIKE '${value}%'
            ORDER BY time ${order} LIMIT ? OFFSET ?`, [pageSize, (page - 1) * pageSize])

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
        const [count] = await db.query('SELECT COUNT(*) AS data_count FROM actions')

        return res.json({message: 'All action data.', count: count})
    } catch (error) {
        return res.status(500).json({message: 'Server error!', error})
    }
})

router.get('/count-selected-data', async (req, res) => {
    const value = req.query.value || ''

    try {
        const [count] = await db.query(`SELECT COUNT(*) AS data_count 
            FROM actions WHERE time LIKE '${value}%'`)

        return res.json({message: `Count ${value} data.`, count: count})
    } catch (error) {
        return res.status(500).json({message: 'Server error!', error})
    }
})

module.exports = router