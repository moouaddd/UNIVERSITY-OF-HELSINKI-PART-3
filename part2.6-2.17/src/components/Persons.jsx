const Persons = ({persons, searchTerm, deleting}) => {

  
  const filteredPersons = persons.filter((person) =>

    person.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return(
    <div>
      <h2 className="titulo">Numbers</h2>
      <ul>
        {filteredPersons.map((person) => (
          <li key={person.id}>
            {person.name} {" "}
            {person.number}
            {" "}
            <button onClick={() => deleting(person.id)}>delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Persons;