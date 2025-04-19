const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../config/database')

const router = express.Router()

router.post('/login', async (req, res) => {
    const { username, password } = req.body

    if(!username || !password){
        return res.status(400).json({ message: 'Missing inputs.'})
    }

    try {
        const users = await db.query('SELECT * FROM users WHERE username = ?', [username])

        if(users.length === 0){
            return res.json({message: 'Invalid username or password.'})
        }

        const user = users[0]
        const matchPassword = await bcrypt.compare(password, user.password)
        if(!matchPassword) {
            return res.status(401).json({message: 'Invalid username or password.'})
        }

        const token = jwt.sign(
            {id: user.id, username: user.username, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: '30d'}
        ) 

        return res.json({message: 'Login successfully!', token: token, data: user})
    } catch (error) {
        return res.status(500).json({message: 'Server error.', error})
    }
})

router.post('/register', async (req, res) => {
    const { username, password, confirmedPassword } = req.body

    if(!username || !password || !confirmedPassword){
        return res.status(400).json({ message: 'Missing input.'})
    }

    if(password !== confirmedPassword){
        return res.status(400).json({message: 'Password not match.'})
    }

    try{
        const existedUser = await db.query('SELECT * FROM users WHERE username = ?', [username])
        if(existedUser > 0){
            return res.status(400).json({message: 'Username already existed.'})
        }

        var hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await db.query('INSERT INTO users (username, password, role, description) VALUES (?, ?, ?, ?)'
            , [username, hashedPassword, 'user', ''])
            
        return res.json({message: 'Registered successfully.', data: newUser})
    }
    catch (error) {
        return res.status(500).json({message: 'Registered failed!', error})
    }
})

router.get('/get-user-with-token', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]

    if(!token){
        return res.status(401).json({message: 'Accsess denied.'})
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        const [user] = await db.query('SELECT * FROM users WHERE id = ?', decode.id)

        return res.json({message: 'Get user successfully.', data: user})
    } catch (error) {
        return res.status(500).json({message: 'Server error', error})
    }
})

router.put('/update-one/:id', async (req, res) => {
    const userId = req.params.id
    const updateData = req.body

    if(Object.keys(updateData).length === 0){
        return res.json({message: 'Nothing to update.'})
    }

    try {
        const users = await db.query('SELECT * FROM users WHERE id = ?', userId)
        if(users.length === 0){
            return res.status(400).json({message: 'Invalid user'})
        }

        const user = users[0]

        const fieldsToUpdate = []
        const values = []

        Object.keys(updateData).forEach((field) => {
            if(updateData[field] !== user[field]) {
                fieldsToUpdate.push(`${field} = ?`)
                values.push(updateData[field])
            }
        })

        if(fieldsToUpdate.length === 0){
            return res.json({message: 'Nothing to update.'})
        }

        values.push(userId)

        const updatedUser = await db.query(`UPDATE users SET ${fieldsToUpdate.join(', ')} WHERE id = ?`
            , values)

        return res.json({message: 'Update user successfully.', data: updatedUser})
    } catch (error) {
        return res.status(500).json({message: 'Server error', error})
    }
})

module.exports = router