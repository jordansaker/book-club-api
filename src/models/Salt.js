import mongoose from "mongoose"

const saltSchema = mongoose.Schema({
  salt: { type: String, required: true, unique: true }
})

const SaltModel = mongoose.model('Salt', saltSchema)

export default SaltModel
