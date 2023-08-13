import express from 'express'
import { dbConnect } from 'db'
import { booksRouter, membersRouter, reviewRouter } from '@src/routes'
import jwt from 'jsonwebtoken'


dbConnect()
const app = express()
const port = 3000

const validateJWT = (req, res, next) => {
  const suppliedToken = req.headers.jwt

  jwt.verify(suppliedToken, process.env.JWT_SECRET, (error, decodedJWT) => {
    if (error) {
      console.log(error)
      throw new Error('User not authenticated.')
    }
    req.decodedJWT = decodedJWT
  })
  next()
}

app.use(express.json())
app.use('/members', validateJWT)
app.use('/books', booksRouter)
app.use('/reviews', reviewRouter)
app.use('/members', membersRouter)

app.listen(port)
