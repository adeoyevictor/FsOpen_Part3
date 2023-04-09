const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose
  .connect(url)
  .then((result) => {
    console.log(result)
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: { type: String, minLength: 3, required: true },
  number: {
    type: String,
    validate: [
      {
        validator: (n) => {
          if ((n[2] === '-' || n[3] === '-') && n.length < 9) {
            return false
          }
          return true
        },
        msg: 'number must have at least 8 digits',
      },
      {
        validator: (n) => {
          return /^\d{2,3}-?\d+$/.test(n)
        },
        msg: 'invalid phone number',
      },
    ],
    required: [true, 'number is required'],
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
