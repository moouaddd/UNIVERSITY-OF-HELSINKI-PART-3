import { useState, useEffect } from 'react';
import Filter from './components/Filter';
import Persons from './components/Persons';
import Users from './components/Users';
import Notification from './components/Notification'
import NotificationSuccess from './components/NotificationSuccess'
import noteService from './services/notes';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  //Getting all the data from the server
  useEffect(() => {
    noteService
      .getAll()
      .then(response => {
        setPersons(response);
      })
  }, []);

  const handleAddPerson = async (e) => {
    e.preventDefault();

    //Cheking if one of the fields are empty
    if (persons.some((person) => person.name === '' || person.number === '')) {
      alert('One of the fields is empty');
      return;
    }

    //Searching for the object who has the same name with the input
    const existingPerson = persons.find((person) => person.name === name && person.number !== number);

    /*If in the array persons exist one object with the same name and different number, we are gonna get his id */
    if (existingPerson) {
      const id = existingPerson.id;

      const userConfirmed = window.confirm("This person is already added to the phonebook, replace the old number with a new one");

      //Calling the function
      if (userConfirmed) {
        await updating(id);
      }
    } else {

      if (name.trim().length <= 3 && number.trim().length <= 8) {
        setErrorMessage(`Name must be at least 3 characters and number must be at least 8 characters`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      } else {

        if (name.trim() !== '' && number.trim() !== '') {
          // Generate a new unique id for the new person
          const newId = (persons.length + 1).toString();

          // Create a new person object, is very important to specify the body
          const newPerson = { id: newId, name: name, number: number };

          noteService
            .create(newPerson)
            .then(newObject => {
              setPersons([...persons, newObject])

              // Clear the name and number input fields
              setName('');
              setNumber('');
              setSuccessMessage(`Person is added`)
              setTimeout(() => {
                setSuccessMessage(null)
              }, 5000)

            })
            .catch(error => {
              setErrorMessage(
                `Note '${persons.id}' was already removed from server`
              )
              setTimeout(() => {
                setErrorMessage(null)
              }, 5000)
              console.error('Error creating a new person', error)
            })
        }
      }
    }
  };

  //We get the id from the object who has the same name and != number 
  const updating = async (id) => {

    // Create a new person object with the updated number
    const updatePerson = { name: name, number: number };

    try {
      const result = await noteService.update(id, updatePerson);
      console.log('ok', result);

      // Update the state to reflect the updated person
      setPersons(persons.map(person => person.id !== id ? person : result));

      setSuccessMessage(`Person is updated`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)

    } catch (error) {
      setErrorMessage(
        `Sorry '${persons.name}' was already removed from server`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      console.error('Error:', error);
    }

  }

  const deleting = async (id) => {
    // Display a confirmation dialog to the user
    const userConfirmed = window.confirm("Are you sure you want to delete this person?");

    // Check if the user confirmed
    if (userConfirmed) {
      try {
        const result = await noteService.remove(id);
        console.log('ok', result);

        // Update the state to reflect the deleted person
        setPersons(persons.filter(person => person.id !== id));

        setSuccessMessage(`Person is deleted`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)

      } catch (error) {
        setErrorMessage(
          `Sorry '${persons.name}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        console.error('Error:', error);
      }
    }
  };

  return (
    <div>
      <NotificationSuccess message={successMessage} />
      <Notification message={errorMessage} />
      <h2 className='titulo'>Phonebook</h2>
      <Filter searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Users handleAddPerson={handleAddPerson} setName={setName} setNumber={setNumber} />
      <Persons persons={persons} searchTerm={searchTerm} deleting={deleting} />
    </div>
  );
};

export default App;
