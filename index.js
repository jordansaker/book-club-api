import express from 'express'
import { dbConnect } from 'db'
import { booksRouter } from '@src/routes'

dbConnect()
const app = express()
const port = 3000

app.use(express.json())
app.use('/books', booksRouter)

app.listen(port)
