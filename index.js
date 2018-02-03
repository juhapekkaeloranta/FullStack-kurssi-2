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
  console.log('trying to get all')
  Contact
    .find({})
    .then(result => {
      res.json(result)
    })
    .catch(error => {
      console.log(error)
      // ...
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

  const newContact = new Contact({
    name: body.name,
    number: body.number,
    id: generateId()
  })
  newContact
    .save()
    .then(res => {
      console.log(
        'Lisätty luetteloon yhteystieto\n  ' +
        newContact.name + ': ' + newContact.number
      )
      response.json(res)
    })
    .catch(error => {
      console.log(error)
      // ...
    })
})

app.delete('/api/persons/:id', (request, response) => {
  const pId = Number(request.params.id)
  
  Contact
    .remove({id: pId})
    .then(result => {
      console.log(result)
      response.status(204).end()
    })
    .catch(error => {
      console.log('failed delete')
      response.status(400).send({ error: 'malformatted id' })
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})