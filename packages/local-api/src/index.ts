import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import path from 'path'
import { createCellsRouter } from './routes/cells'

export const serve = (port: number, filename: string, dir: string, useProxy: boolean) => {

    // console.log('serving traffic on port', port)
    // console.log('saving/fetching cells from', filename)
    // console.log('that file is in dir', dir)
    const app = express()


    if (useProxy) {
        app.use(createProxyMiddleware({
            target: 'http://localhost:3000',
            ws: true,
            logLevel: 'silent'
        }))

    } else {
        const packagePath = require.resolve('local-client/build/index.html')
        console.log(packagePath)
        app.use(express.static(path.dirname(packagePath)))
    }
    app.use(createCellsRouter(filename, dir))

    return new Promise<void>((resolve, reject) => {
        app.listen(port, resolve).on('error', reject)
    })

}