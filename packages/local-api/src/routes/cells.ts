import express from 'express'
import fs from 'fs/promises'
import path from 'path'

interface Cell {
    id: string
    content: string
    type: 'text' | 'code'
}

export const createCellsRouter = (filename: string, dir: string) => {

    const router = express.Router()
    router.use(express.json())

    const fullPath = path.join(dir, filename)

    router.get('/cells', async (req, res) => {

        try {
            // read the file
            const result = await fs.readFile(fullPath, { encoding: 'utf-8' })

            res.send(JSON.parse(result))

        } catch (error) {
            if (error.code === 'ENOENT') {
                // Add code to create a file and add default cells
                await fs.writeFile(fullPath, '[]', 'utf-8')
                res.send([])
            } else {
                throw error
            }
        }


        // if read thtows an error

        // inspect the error, see if it says that file not exist


        // parse a list of cells out of it

        // send list of cells back to browser

    })

    router.post('/cells', async (req, res) => {

        // take th list of cells from req obj

        // serialize them
        const { cells }: { cells: Cell[] } = req.body

        // write the cells into the file
        console.log(fullPath)
        await fs.writeFile(fullPath, JSON.stringify(cells), 'utf-8')

        res.send({ status: 'OK' })
    })

    return router
}
