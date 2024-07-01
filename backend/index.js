require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Phonebook = require('./phonebook')

const app = express()

// this has to be the last loaded middleware, also all the routes should be registered before this!

app.use(express.json())
app.use(morgan(':method :url :body'))
app.use(express.static('dist'))
app.use(cors())

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

app.get('/info', (request, response) => {
  const date = new Date()

  Phonebook.find({}).then(phonebook => {
    response.send(`<p>Phonebook has info for ${phonebook.length} people</p>
    <p>${date}</p>`)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Phonebook.findById(request.params.id)
    .then(person => {
      if (person){
        response.json(person)
      }else{
        response.status(404).end()
      }}
    ).catch(error => {
      next(error)
    })
})

app.get('/api/persons', (request, response) => {
  Phonebook.find({}).then(phonebook => {
    response.json(phonebook)
  })
})
app.delete('/api/persons/:id', (req, res) => {
  console.log(req.params.id)
  console.log(Phonebook)
  Phonebook.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => {
      res.status(400).send( `${error}: malformatted id` )
    })
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (body.name === undefined || body.number === undefined) {
    return res.status(400).json({ error: 'Name or number missing' })
  }

  Phonebook.findOne({ name: body.name })
    .then(existingPerson => {
      if (existingPerson) {
        throw new Error('Name must be unique')
      }

      const person = new Phonebook({
        name: body.name,
        number: body.number,
      })

      return person.save()
    })
    .then(savedPerson => {
      res.json(savedPerson)
    })
    .catch(error => {
      res.status(400).json({ error: error.message })
    })
})

app.put('/api/persons/:id', (req, res) => {
  const body = req.body

  const isValidNumber = /\d{2,3}-\d{5,6}/.test(body.number)
  if (!isValidNumber) {
    return res.status(400).json({ error: 'Invalid phone number' })
  }

  const person = {
    name: body.name,
    number: body.number
  }

  Phonebook.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => {
      res.status(400).json({ error: error.message })
    })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 10000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})