import proxy from './proxy'

export default function proxyPlugin(authRoot, apiRoot) {
    return {
        name: 'proxy-plugin',
        configureServer(server) {
            server.middlewares.use(proxy(authRoot, apiRoot))
        }
    }
}