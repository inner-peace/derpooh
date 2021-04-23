const express = require('express')
const app = express()
const port = 3001

// allow cors for local dev
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control");
    next();
});

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({extended: true})) // for parsing application/x-www-form-urlencoded


const users = {
    'demo@demo.com': {
        email: 'demo@demo.com',
        token: '12312adasd',
        password: 'demo'
    }
}

app.post('/api/validate', (req, res) => {
    res.json({
        status: req.body.email in users
    })
})

app.post('/api/login', (req, res) => {
    if (req.body.email && users[req.body.email] && users[req.body.email].password === req.body.password) {
        res.json({
            status: true,
            token: users[req.body.email].token,
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
