import { Router } from "express"
import { BookModel, MemberModel } from "@src/models"
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import saltToAdd from "../../bcrypt_salt.js"

dotenv.config()

const router = Router()

function generateJWT(userDetailsObject) {
  return jwt.sign(userDetailsObject, process.env.JWT_SECRET, { expiresIn: '7d' })
}


const validateBasicAuth = (req, res, next) => {
  let authHeader = req.headers['authorization'] ?? null

  if (authHeader == null) {
    throw new Error('No auth data detected on a request to protected route')
  }

  authHeader = authHeader.startsWith('Basic ') && authHeader.substring(5).trim()

  console.log('Provided base64 auth string is: ' + authHeader)

  let decodedAuth = Buffer.from(authHeader, 'base64').toString('ascii')
  let splitDecodedAuth = decodedAuth.split(':')
  let decodedAuthObj = {
    username: splitDecodedAuth[0],
    password: splitDecodedAuth[1]
  }
  req.userAuthDetails = decodedAuthObj
  next()
}

const hashAndSaltAuth = async (req, res, next) => {
  console.log('Object of auth data is: ' + JSON.stringify(req.userAuthDetails))
  let hashedAndSaltedPassword = await bcrypt.hash(req.userAuthDetails.password, saltToAdd)
  let user = await MemberModel.findOne( {username:  'jscairns'} )
  console.log(user)
  let passwordsMatch = await bcrypt.compare( user.password, hashedAndSaltedPassword)
  console.log(saltToAdd)
  console.log(passwordsMatch)
  next()
}


router.get('/', validateBasicAuth, hashAndSaltAuth, async (req, res) => {
  const userJWT = generateJWT(req.userAuthDetails)
  res.send({
    books: await BookModel.find(),
    token: userJWT
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