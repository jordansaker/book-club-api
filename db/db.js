import mongoose from 'mongoose'

async function dbConnect () {
  try {
    mongoose.connect('mongodb://127.0.0.1:27017/book_club')
    console.log('Mongoose connected')
  } catch (error) {
    console.log({ error: error.message })
  }
}

async function dbClose () {
  mongoose.connection.close()
  console.log('Mongoose disconnected')
}

export {
  dbConnect,
  dbClose
}
