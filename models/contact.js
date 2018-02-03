const mongoose = require('mongoose')

// korvaa url oman tietokantasi urlilla!
const url = 'mongodb://app-contacts:jfios84dsa@ds123258.mlab.com:23258/contacts-db'

mongoose.connect(url)
mongoose.Promise = global.Promise;

const Contact = mongoose.model('Contact', {
  name: String,
  number: String
})

const createNewContact = (pName, pNumber) => {
  new Contact({
    name: pName,
    number: pNumber
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