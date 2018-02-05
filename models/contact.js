const mongoose = require('mongoose')
require('dotenv').config()
const url = ''
if (process.env.NODE_ENV === 'production') {
  console.log('PRD')
  url = process.env.PRD_MONGODB_URI
} else {
  console.log('DEV')
  url = process.env.DEV_MONGODB_URI
}

mongoose.connect(url)
mongoose.Promise = global.Promise;

const Contact = mongoose.model('Contact', {
  name: String,
  number: String,
  id: Number
})

const createNewContact = (pName, pNumber, pId) => {
  new Contact({
    name: pName,
    number: pNumber,
    id: pId
  })
    .save()
    .then(response => {
      console.log(
        'Lisätty luetteloon yhteystieto\n  ' +
        pName + ': ' + pNumber
      )
      mongoose.connection.close()
    })
}

const showAllContacts = () => {
  const listAll = []
  Contact
  .find({})
  .then(result => {
    result.forEach(item => {
      //console.log(item)
      listAll.push(item)
    })
    mongoose.connection.close()
    console.log(formatContacts(listAll))
    return 'palauta lista async odottajalle'
  })
}

const getAllContacts = () => {
  const listAll = []
  Contact
  .find({})
  .then(result => {
    mongoose.connection.close()
    return result
  })
}

const formatContacts = (pContacts) => {
  let resultString = 'Puhelinluettelo:\n'
  pContacts.forEach(item => {
    resultString = resultString.concat('  ' + item.name + ': ' + item.number + '\n')
  })
  return resultString
}

const deleteContact = (pId) => {
  Contact
    .findByIdAndRemove(pId)
    .then(result => {
      console.log(result)
      //response.status(204).end()
    })
    .catch(error => {
      console.log('failed')
      //response.status(400).send({ error: 'malformatted id' })
    })
} 

const main = () => {
  const parameters = process.argv.slice(2)

  if (parameters.length === 0) {
    console.log(getAllContacts())
  } else if (parameters.length === 2) {
    createNewContact(parameters[0], parameters[1])
  } else {
    console.log('error: wrong number of parameters')
  }
}

//main()

module.exports = Contact