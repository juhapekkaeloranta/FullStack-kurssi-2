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
 
const generateId = () => {
  return Math.floor((Math.random() * 10000000000) + 1);
}

const nameExistsInContacts = (nameToLook) => {
  Contact
    .find({name: nameToLook})
    .then(result => {
      return result.length > 0
    })
    .catch(error => {
      console.log(error)
    })
}

const idExistsInContacts = (idToLook) => {
  Contact
    .find({id: idToLook})
    .then(result => {
      return result.length > 0
    })
    .catch(error => {
      console.log(error)
    })
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
  const postedObject = request.body

  if (postedObject.name === undefined) {
    return response.status(403).json({ error: 'name missing!' })
  }

  if (postedObject.number === undefined) {
    return response.status(403).json({ error: 'number missing!' })
  }

  if (nameExistsInContacts(postedObject.name)) {
    return response.status(403).json({ error: 'duplicate name!' })
  }

  const newContact = new Contact({
    name: postedObject.name,
    number: postedObject.number,
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

app.put('/api/persons/:id', (request, response) => {
  const pId = Number(request.params.id)
  const postedObject = request.body

  //console.log('PUT not yet implemented')
  console.log(postedObject)
  Contact
    .update({id: pId}, {number: postedObject.number})
    .then(result => {
      console.log('update success');
      console.log(result);
      response.status(204).end()
    })
    .catch(error => {
      console.log('update failure');
      console.log(error);
      response.status(400).send({ error: 'update failed' })
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