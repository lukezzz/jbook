import * as esbuild from 'esbuild-wasm'
import axios from 'axios'
import localForge from 'localforage'

const fileCache = localForge.createInstance({
    name: 'filecache'
});

export const fetchPlugin = (inputCode: string) => {
    return {
        name: 'fetch-plugin',
        setup(build: esbuild.PluginBuild) {
            build.onLoad({ filter: /(^index\.js$)/ }, () => {
                return {
                    loader: 'jsx',
                    contents: inputCode
                };
            })
            build.onLoad({ filter: /.*/ }, async (args: any) => {
                console.log('I ran but didnot do a thing')
                // Check to see if we have already fetched this file
                // and if it is in the cache

                const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path)

                // if it is, return it immediately
                if (cachedResult) {
                    return cachedResult
                }

            })
            build.onLoad({ filter: /.css$/ }, async (args: any) => {


                const { data, request } = await axios.get(args.path)
                // store response in cache

                const escaped = data
                    .replace(/\n/g, '')
                    .replace(/"/g, '\\"')
                    .replace(/'/g, "\\'")
                const contents =
                    `
                            const style = document.createElement('style');
                            style.innerText = '${escaped}';
                            document.head.appendChild(style);
                        `

                const result: esbuild.OnLoadResult = {
                    loader: 'jsx',
                    contents,
                    resolveDir: new URL('./', request.responseURL).pathname
                }
                await fileCache.setItem(args.path, result)

                return result
            })
            build.onLoad({ filter: /.*/ }, async (args: any) => {
                console.log('onLoad', args);

                // if (args.path === 'index.js') {
                //     return {
                //         loader: 'jsx',
                //         // contents: `
                //         //     import React, {useState} from 'react';
                //         //     console.log(React, useState);
                //         //     `,
                //         contents: inputCode
                //     };
                // }
                // else {
                //     return {
                //         loader: 'jsx',
                //         contents: 'export default "hi there!"',
                //     };
                // }



                const { data, request } = await axios.get(args.path)
                // store response in cache


                const result: esbuild.OnLoadResult = {
                    loader: 'jsx',
                    contents: data,
                    resolveDir: new URL('./', request.responseURL).pathname
                }
                await fileCache.setItem(args.path, result)

                return result

                // console.log(request)
                // return {
                //     loader: 'jsx',
                //     contents: data,
                //     resolveDir: new URL('./', request.responseURL).pathname
                // }
            });
        }
    }
}