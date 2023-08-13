import bcrypt from 'bcrypt'

const saltRounds = 10

const saltToAdd = await bcrypt.genSalt(saltRounds)

export default saltToAdd
