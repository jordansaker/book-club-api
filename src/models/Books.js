import mongoose from 'mongoose'

const bookSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  authorName: { type: String, required: true, unique: true },
  yearPublished: { type: Number, required: true, cast: false }
})

const BookModel = mongoose.model('Book', bookSchema)

export {
  BookModel
}
