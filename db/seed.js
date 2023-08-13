import { BookModel, ReviewModel, MemberModel, SaltModel } from "@src/models"
import { dbConnect, dbClose } from "db"
import bcrypt from 'bcrypt'
import saltToAdd from "../bcrypt_salt.js"

dbConnect()

await SaltModel.deleteMany()
console.log('Salt deleted')
const saltInserted = await SaltModel.create({ salt: saltToAdd })
console.log('Salt added')

const books = [
  {
    name: "Joel Selwood: All In",
    authorName: "Joel Selwood",
    yearPublished: 2023
  },
  {
    name: "A Father's Son",
    authorName: "Mat Rogers",
    yearPublished: 2022
  },
  {
    name: "True Spirit",
    authorName: "Jessica Watson",
    yearPublished: 2011
  },
  {
    name: "Trust",
    authorName: "Jeanne Ryckmans",
    yearPublished: 2023
  }
]

await BookModel.deleteMany()
console.log('Deleted books')
const booksInserted = await BookModel.insertMany(books)
console.log('Added books')

const members = [
  {
    name: "Josh Phillips",
    favouriteBook: booksInserted[3],
    username: 'jpcairns',
    password: await bcrypt.hash('SicBoiPass', saltInserted.salt)
  },
  {
    name: "Jordan Saker",
    favouriteBook: booksInserted[2],
    username: 'jscairns',
    password: await bcrypt.hash('SicBoiPassTwo', saltInserted.salt)
  },
  {
    name: "Luke Donnet",
    favouriteBook: booksInserted[0],
    username: 'ldcairns',
    password: await bcrypt.hash('SicBoiPassThree', saltInserted.salt)
  }
]

await MemberModel.deleteMany()
console.log('Deleted members')
const mems = await MemberModel.insertMany(members)
console.log('Members added')

const reviews = [
  {
    book: booksInserted[3],
    member: mems[0],
    reviewText: "I like the content of this book."
  },
  {
    book: booksInserted[2],
    member: mems[1],
    reviewText: "This is a cool book."
  }
]

await ReviewModel.deleteMany()
console.log('Deleted reviews')
const addReviews = await ReviewModel.insertMany(reviews)
console.log('Added reviews')

dbClose()
