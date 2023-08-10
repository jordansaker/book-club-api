import mongoose from 'mongoose'

const reviewSchema = mongoose.Schema({
  book: { type: mongoose.SchemaTypes.ObjectId, ref: 'Book' },
  member: { type: mongoose.SchemaTypes.ObjectId, ref: 'Member' },
  reviewText: { type: String, required: true }
})

const ReviewModel = mongoose.model('Review', reviewSchema)

export {
  ReviewModel
}
