import express from 'express'
import { dbConnect } from 'db'
import { booksRouter, membersRouter, reviewRouter } from '@src/routes'
import jwt from 'jsonwebtoken'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'


dbConnect()
const app = express()
const port = 3000

const validateJWT = (req, res, next) => {

  const token = req.cookies.accessToken
  if (!token) {
    return res.sendStatus(403);
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, token) => {
    if (error) {
      console.log(error)
      throw new Error('User not authenticated.')
    }
    req.token = token
  })
  next()
}

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      "script-src": ["'self'"],
    }
  }
}))

// need cookie-parser to parse-cookies
app.use(cookieParser())
app.use(express.json())
app.use('/members', validateJWT)
app.use('/books', booksRouter)
app.use('/reviews', reviewRouter)
app.use('/members', membersRouter)

app.listen(port)
