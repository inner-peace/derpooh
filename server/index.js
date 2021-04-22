const express = require('express')
const app = express()
const port = 3001

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const users = {
    'demo@demo.com': {
        email: 'demo@demo.com',
        token: '12312adasd'
    }
}

app.post('/api/validate', (req, res) => {
    if (req.body.email) {
        res.json({
            status: true
        })
    }
})

app.post('/api/login', (req, res) => {
    if (req.body.email && users[req.body.email]) {
        res.json({
            status: true,
            data: users[req.body.email],
        })
    } else {
        res.json({
            status: false
        })
    }
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})
