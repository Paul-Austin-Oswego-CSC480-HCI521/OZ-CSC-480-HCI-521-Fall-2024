import express from 'express'
import proxy from './proxy.js'
import https from 'https'
import fs from 'fs'

const app = proxy(process.env.AUTH_ROOT, process.env.API_ROOT)

app.use(express.static('/www/data/'))
app.get('*', (req, res) => {
    res.sendFile('/www/data/index.html')
})

https.createServer({
    pfx: fs.readFileSync(process.env.CERT_LOCATION),
    passphrase: process.env.CERT_PASSWORD
}, app).listen(process.env.FRONTEND_PORT, () => {
    console.log(`started server on port ${process.env.FRONTEND_PORT}`)
})
