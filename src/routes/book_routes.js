import { Router } from "express"
import { BookModel } from "@src/models"

const router = Router()

router.get('/', async (req, res) => {
  res.send(await BookModel.find())
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