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

    async function getJwt(req, res) {
        if (req.cookies.ozSessionID == undefined)
            return null
        const response = await instance.get(authRoot + '/auth/jwt', { headers: { 'Oz-Session-Id': req.cookies.ozSessionID } })
            .catch(error => handleRequestError(error, res, 'getJwt'))
        return await response.data
    }

    async function authHeaders(req, res, headers) {
        headers = headers ? headers : {}
        headers['Authorization'] = 'Bearer ' + await getJwt(req, res)
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
                    .catch(error => handleRequestError(error, res, 'get: ' + req.path))
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
                }).catch(error => handleRequestError(error, res, 'post: ' + req.path))
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
                }).catch(error => handleRequestError(error, res, 'put: ' + req.path))
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
                    .catch(error => handleRequestError(error, res, 'delete: ' + req.path))
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
            if (!(await getJwt(req))) {
                res.status(401).send('Session expired or invalid')
            } else
                res.send()
        } catch (error) {
            res.status(500).send(error.message)
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
    // get all trashed projects
    app.get('/projects/trash', proxyGet())
    // trash a given project
    app.put('/projects/trash/:projectId', proxyPut())
    // restore a given project
    app.put('/projects/restore/:projectId', proxyPut())
    // delete a given project
    app.delete('/projects/:projectId', proxyDelete())
    // get all trashed projects
    app.get('/projects/trash', proxyGet())
    // trash given project
    app.put('/projects/trash/:projectId', proxyPut())
    // restore given project
    app.put('/projects/restore/:projectId', proxyPut())

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