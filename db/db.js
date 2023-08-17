import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

async function dbConnect () {
  try {
    mongoose.connect(process.env.LOCAL_DB_URL)
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
