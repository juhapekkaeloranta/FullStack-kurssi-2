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
      console.log('contact saved!')
      mongoose.connection.close()
    })
}

const getAllContacts = () => {
  Contact
  .find({})
  .then(result => {
    result.forEach(item => {
      console.log(item)
    })
    mongoose.connection.close()
  })
}

const testCLparameters = () => {
  process.argv.slice(2).forEach(function (val, index, array) {
    console.log(index + ': ' + val);
  });
}

//createNewContact('Heppu2', '123123123')
//getAllContacts()

testCLparameters()