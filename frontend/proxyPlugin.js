import express from 'express'
import axios from 'axios'
import https from 'https'
import cookieParser from 'cookie-parser'

let AUTH_ROOT = ''
let API_ROOT = ''

const app = express()
app.use(cookieParser(), express.json())

const instance = axios.create({
    // TODO: get a real cert rather than a self signed cert (ask paul)
    httpsAgent: new https.Agent({ rejectUnauthorized: false })
})

async function getJwt(req) {
    if (req.cookies.ozSessionID == undefined) {
        console.log('no cookie')
        throw { response: { status: 401, data: 'no sessionID cookie' } }
    }
    return (await instance.get(AUTH_ROOT + '/auth/jwt', { headers: { 'Oz-Session-Id': req.cookies.ozSessionID } })).data
}

async function authHeaders(req, headers) {
    headers = headers ? headers : {}
    headers['Authorization'] = 'Bearer ' + await getJwt(req)
    return headers
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

function proxyGet() {
    return async (req, res) => {
        try {
            const response = await instance.get(API_ROOT + req.path, { headers: await authHeaders(req) })
            res.send(response.data).end()
        } catch (error) {
            handleRequestError(error, res, 'get: ' + req.path)
        }
    }
}

function proxyPost() {
    return async (req, res) => {
        try {
            const response = await instance.post(API_ROOT + req.path, req.body, {
                headers: await authHeaders(req, {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                })
            })
            res.send(response.data).end()
        } catch (error) {
            handleRequestError(error, res, 'post: ' + req.path)
        }
    }
}

function proxyPut() {
    return async (req, res) => {
        try {
            const response = await instance.put(API_ROOT + req.path, req.body, {
                headers: await authHeaders(req, {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                })
            })
            res.send(response.data).end()
        } catch (error) {
            handleRequestError(error, res, 'put: ' + req.path)
        }
    }
}

function proxyDelete() {
    return async (req, res) => {
        try {
            const response = await instance.delete(API_ROOT + req.path, { headers: await authHeaders(req) })
            res.send(response.data).end()
        } catch (error) {
            handleRequestError(error, res, 'delete: ' + req.path)
        }
    }
}


// ****** user routes *******
// check if the user is authenticated
app.get('/auth', async (req, res) => {
    try {
        await getJwt(req)
        res.send()
    } catch (error) {
        res.status(401).send(error.message)
    }
})
// get user details (may subsume /auth's functionality)
app.get('/user', proxyGet())

// ****** project routes ******
// get all projects
app.get('/projects', proxyGet())
// create a new project
app.post('/projects', proxyPost())
// get a specific project
app.get('/projects/:projectId', proxyGet())
// update a given project
app.put('/projects/:projectId', proxyPut())
// delete a given project
app.delete('/projects/:projectId', proxyDelete())

// ****** task routes ******
// get all accessable tasks
app.get('/tasks', proxyGet())
// create a new task
app.post('/tasks', proxyPost())
// get a specific task
app.get('/tasks/:taskId', proxyGet())
// update a given task
app.put('/tasks/:taskId', proxyPut())
// delete a given task
app.delete('/tasks/:taskId', proxyDelete())

// get all completed tasks
app.get('/tasks/completed', proxyGet())
// get all trashed tasks
app.get('/tasks/trash', proxyGet())
// move a task to the trash
app.put('/tasks/trash/:taskId', proxyPut())
// get all past due tasks **NOT IMPLEMENTED YET**
app.get('/tasks/past-due', proxyGet())
// restore a task from the trash
app.put('/tasks/restore/:taskId', proxyPut())

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