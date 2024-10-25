import express from 'express'
import axios from 'axios'
import https from 'https'
import cookieParser from 'cookie-parser'

let AUTH_ROOT = ''
let API_ROOT = ''

const app = express()
app.use(cookieParser(), express.json())

const instance = axios.create({
    httpsAgent: new https.Agent({ rejectUnauthorized: false })
})

async function getJwt(req) {
    if (req.cookies.sessionID == undefined) {
        throw { response: { status: 401, data: 'no sessionID cookie' } }
    }

    return (await instance.get(AUTH_ROOT + '/auth/jwt', { headers: { 'Oz-Session-Id': req.cookies.sessionID } })).data
}

function handleRequestError(error, res, context) {
    console.log(context)
    if (error.response) {       
        console.log(`response error ${error.response.status}:`)
        console.log(error.response.data)
        res.status(error.response.status).send(error.response.data)
    } else if (error.request) {
        console.log('request error')
        res.status(404).send('no response')
    } else {
        console.log(`error: ${error.message}`)
        res.status(500).send(error.message)
    }
}

function proxyGet(endpoint) {
    return async (req, res) => {
        try {
            const response = await instance.get(API_ROOT + endpoint, { headers: await authHeaders(req) })
            res.send(response.data).end()
        } catch (error) {
            handleRequestError(error, res, 'get: ' + endpoint)
        }
    }
}

function proxyPost(endpoint) {
    return async (req, res) => {
        try {
            const response = await instance.post(API_ROOT + endpoint, req.body, {
                headers: await authHeaders(req, {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                })
            })
            res.send(response.data).end()
        } catch (error) {
            handleRequestError(error, res, 'post: ' + endpoint)
        }
    }
}

app.get('/tasks', proxyGet('/tasks'))
app.post('/tasks', proxyPost('/tasks'))
app.get('/auth', async (req, res) => {
    try {
        await getJwt(req)
        res.send()
    } catch {
        res.sendStatus(401)
    }
})
app.delete('/tasks/:taskId', async (req, res) => {
    try {
        const response = await instance.delete(API_ROOT + '/tasks/' + req.params.taskId, { headers: await authHeaders(req) })
        res.send(response.data).end()
    } catch (error) {
        handleRequestError(error, res, 'delete: /tasks/:taskId')
    }
})

async function authHeaders(req, headers) {
    headers = headers ? headers : {}
    headers['Authorization'] = 'Bearer ' + await getJwt(req)
    return headers
}

export default function proxyPlugin(authRoot, apiRoot) {
    AUTH_ROOT = authRoot
    API_ROOT = apiRoot
    return {
        name: 'proxy-plugin',
        configureServer(server) {
            server.middlewares.use(app)
        }
    }
}