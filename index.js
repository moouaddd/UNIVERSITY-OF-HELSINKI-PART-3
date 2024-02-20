const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(express.json());

morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});

app.use(morgan(':method :url :body'));

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
];

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/info', (request, response) => {
  const date = new Date();
  const numberPersons = persons.length;

  response.send(`<p>Phonebook has info for ${numberPersons} people</p> <br/> <p>${date}</p>`);
});

app.get('/api/persons/4', (request, response) => {
  response.json(persons[3]);
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);

  res.status(204).end();
});

const generateId = () => {
  const maxId = persons.length > 0 ? Math.floor(Math.random(...persons.map(n => n.id)) * 100000) : 0;

  return maxId + 1;
};

app.post('/api/persons', (req, res) => {
  const body = req.body;
  body.name = 'Mouad Halim Hajji';
  body.number = '626671876865';

  try {
    if (body.name === '' || body.number === '') {
      throw new Error('All fields must not be empty');
    }

    const duplicateName = persons.find(person => person.name === body.name);
    if (duplicateName) {
      throw new Error('Name must be unique');
    }

    const person = {
      id: generateId(),
      name: body.name,
      number: body.number,
    };

    persons = persons.concat(person);

    res.json(person);

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
