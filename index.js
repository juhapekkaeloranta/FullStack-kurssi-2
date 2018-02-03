const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Contact = require('./models/contact.js')

morgan.token('reqBody', function getCustom (req) {
  return JSON.stringify(req.body)
})

app.use(express.static('build'))
app.use(cors())
app.use(morgan(':method :url :status :reqBody - :response-time ms'))
app.use(bodyParser.json())

let persons = [
  {
    "name": "Martti Tienari",
    "number": "040-123456",
    "id": 2
  },
  {
    "name": "Arto Järvinen",
    "number": "040-12312300",
    "id": 5
  },
  {
    "name": "Arto Hellas",
    "number": "123-1",
    "id": 7
  }
]

const deleteIdFromContacts = (id) => {
  persons = persons.filter(person => person.id !== id)
}

const idExistsInContacts = (idToFind) => {
  return persons.find(person => person.id === idToFind)
}

const nameExistsInContacts = (nameToFind) => {
  return persons.find(person => person.name === nameToFind)
}
 
const generateId = () => {
  const maxId = persons.length > 0 ? persons.map(n => n.id).sort().reverse()[0] : 1
  return maxId + 1
}

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
  const personCount = persons.length
  const dateString = new Date().toString()
  res.send(
    '<p>Puhelinluettelossa on ' + personCount + ' henkilön tiedot</p>' +
    '<p>' + dateString + '</p>'
  )
})

app.get('/api/persons', (req, res) => {
  Contact
    .find({})
    .then(all => {
      res.json(all)
    })
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)

  if (idExistsInContacts(id)) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(403).json({ error: 'name missing!' })
  }

  if (body.number === undefined) {
    return response.status(403).json({ error: 'number missing!' })
  }

  if (nameExistsInContacts(body.name)) {
    return response.status(403).json({ error: 'duplicate name!' })
  }

  const newPerson = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(newPerson)

  response.json(newPerson)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  
  if (idExistsInContacts(id)) {
    deleteIdFromContacts(id)
    response.status(204).end()
  } else {
    response.status(404).end()
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})