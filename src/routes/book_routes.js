import { Router } from "express"
import { BookModel, MemberModel, SaltModel } from "@src/models"
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'

dotenv.config()

const router = Router()

function generateJWT(userDetailsObject) {
  return jwt.sign(userDetailsObject, process.env.JWT_SECRET, { expiresIn: '1h' })
}


const validateBasicAuth = (req, res, next) => {
  let authHeader = req.headers['authorization'] ?? null

  if (authHeader == null) {
    throw new Error('No auth data detected on a request to protected route')
  }

  authHeader = authHeader.startsWith('Basic ') && authHeader.substring(5).trim()

  let decodedAuth = Buffer.from(authHeader, 'base64').toString('ascii')
  let splitDecodedAuth = decodedAuth.split(':')
  let decodedAuthObj = {
    username: splitDecodedAuth[0],
    password: splitDecodedAuth[1]
  }
  req.userAuthDetails = decodedAuthObj
  next()
}

const verifyAuth = async (req, res, next) => {
  const user = await MemberModel.findOne( {username:  req.userAuthDetails.username} )
  const passwordsMatch = await bcrypt.compare( req.userAuthDetails.password, user.password)
  if (!passwordsMatch) {
    res.send({ error: 'Invalid email or password' })
  }
  else {
    const decodedAuthObjExPassword = {
      username: req.userAuthDetails.username
    }
    req.userAuthDetails = decodedAuthObjExPassword
    req.userJWT = generateJWT(req.userAuthDetails)
    // set token in cookie
    // https://ironeko.com/posts/how-to-store-access-tokens-localstorage-cookies-or-httponly
    res.setHeader('Set-Cookie', [
      `accessToken=${req.userJWT}; HttpOnly; Max-Age=${1800};`,
    ])    
    next()
  }
}


router.get('/', validateBasicAuth, verifyAuth, async (req, res) => {
  res.send({
    books: await BookModel.find(),
    token: req.userJWT
  })
})

router.get('/:id', async (req, res) => {
  try {
    const book = await BookModel.findById(req.params.id)
    book ? res.send(book) : res.status(404).send({ error: 'Book not found' })
  }
  catch (error) {
    res.status(500).send({ error: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const addedBook = await BookModel.create(req.body)
    res.status(201).send(addedBook)
  }
  catch (error) {
    res.status(500).send({ error: error.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const book = await BookModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
    book ? res.send(book) : res.status(404).send({ error: 'Book not found' })
  }
  catch (error) {
    res.status(500).send({ error: error.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const book = await BookModel.findByIdAndDelete(req.params.id)
    book ? res.sendStatus(200) : res.status(400).send({ error: 'Book not found' })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

export default router