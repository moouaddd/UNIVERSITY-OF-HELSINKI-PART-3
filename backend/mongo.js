const mongoose = require('mongoose')

if (process.argv.length<5) {
  console.log('give password, name and number as arguments')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3];
const number = process.argv[4];

const url = process.env.MONGODB_URL;

mongoose.set('strictQuery',false)

mongoose.connect(url)

const phoneSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Phonebook = mongoose.model('Phonebook', phoneSchema)

const phonebook = new Phonebook({
   name,
   number,
})

phonebook.save().then(result => {
  console.log(`added ${name} number ${number} to phonebook`)
})

Phonebook.find({}).then(result => {
    result.forEach(phonebook => {
      console.log(phonebook)
    })
    mongoose.connection.close()
  })