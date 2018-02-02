const express = require('express')
const app = express()
const bodyParser = require('body-parser')

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
    "number": "123",
    "id": 7
  }
]

const deleteIdFromContacts = (id) => {
  persons = persons.filter(person => person.id !== id)
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
  res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(note => note.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

const generateId = () => {
  const maxId = persons.length > 0 ? persons.map(n => n.id).sort().reverse()[0] : 1
  return maxId + 1
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ error: 'name missing' })
  }

  if (body.number === undefined) {
    return response.status(400).json({ error: 'number missing' })
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
  
  const idIsExists = persons.find(person => person.id === id)
  console.log(idIsExists)
  
  if (idIsExists) {
    deleteIdFromContacts(id)
    response.status(204).end()
  } else {
    response.status(404).end()
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})