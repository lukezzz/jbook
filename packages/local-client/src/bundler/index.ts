import * as esbuild from 'esbuild-wasm'
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin'
import { fetchPlugin } from './plugins/fetch-plugin'

let service = esbuild.initialize({
    // worker: true,
    // wasmURL: '/esbuild.wasm'
    wasmURL: 'https://unpkg.com/esbuild-wasm@0.12.20/esbuild.wasm'
})

const bundle = async (rawCode: string) => {
    if (!service) {
        try {
            await esbuild.initialize({
                // worker: true,
                wasmURL: '/esbuild.wasm'
                // wasmURL: 'https://unpkg.com/esbuild-wasm@0.12.20/esbuild.wasm'
            })
        } catch (err) {
            console.log(err)
        }
    }

    try {

        const result = await esbuild.build({
            entryPoints: ['index.js'],
            bundle: true,
            write: false,
            plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
            define: {
                'process.env.NODE_ENV': '"development"',
                global: 'window'
            },
            jsxFactory: '_React.createElement',
            jsxFragment: '_React.Fragment'
        })
        return {
            code: result.outputFiles[0].text,
            err: ''
        }
    } catch (err) {
        return {
            code: '',
            err: err.message
        }
    }


}

export default bundle