import express from 'express'
import axios from 'axios'
import https from 'https'
import cookieParser from 'cookie-parser'

export default function proxyPlugin(authRoot, apiRoot) {

    const app = express()
    app.use(cookieParser(), express.json())

    const instance = axios.create({
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
    })

    async function getJwt(req) {
        if (req.cookies.ozSessionID == undefined) {
            throw { response: { status: 401, data: 'no sessionID cookie' } }
        }
        return (await instance.get(authRoot + '/auth/jwt', { headers: { 'Oz-Session-Id': req.cookies.ozSessionID } })).data
    }

    async function authHeaders(req, headers) {
        headers = headers ? headers : {}
        headers['Authorization'] = 'Bearer ' + await getJwt(req)
        return headers
    }

    async function handleRequestError(error, res, context) {
        if (error.response) {
            const content = await error.response.data
            console.log(`[${context}] response error ${error.response.status}: `, content)
            res.status(error.response.status).send(content)
        } else if (error.request) {
            console.log(`[${context}] request error`)
            res.status(404).send('no response')
        } else {
            console.log(`[${context}] error: ${error.message}`)
            res.status(500).send(error.message)
        }
    }

    function proxyGet() {
        return async (req, res) => {
            try {
                const response = await instance.get(apiRoot + req.path, { headers: await authHeaders(req) })
                res.send(response.data).end()
            } catch (error) {
                handleRequestError(error, res, 'get: ' + req.path)
            }
        }
    }

    function proxyPost() {
        return async (req, res) => {
            try {
                const response = await instance.post(apiRoot + req.path, req.body, {
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
                const response = await instance.put(apiRoot + req.path, req.body, {
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
                const response = await instance.delete(apiRoot + req.path, { headers: await authHeaders(req) })
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
    // get user details
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

    return {
        name: 'proxy-plugin',
        configureServer(server) {
            server.middlewares.use(app)
        }
    }
}