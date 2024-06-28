const Users = ({handleAddPerson, setName, setNumber, name, number}) => {
 
    return(
        <div>
            <form onSubmit={handleAddPerson}>
                <div>
                <h1 className="titulo">Add a new</h1>
                </div>
                <div>
                name: <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                </div>
                <div>
                number: <input
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                />
                </div>
                <div>
                <button type="submit">add</button>
                </div>
             </form>
        </div>
    )
}


export default Users;