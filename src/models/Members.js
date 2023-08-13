import mongoose from 'mongoose'

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  favouriteBook: { type: mongoose.SchemaTypes.ObjectId, ref: 'Book', required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true }
})

const MemberModel = mongoose.model('Member', memberSchema)

export {
  MemberModel
}
