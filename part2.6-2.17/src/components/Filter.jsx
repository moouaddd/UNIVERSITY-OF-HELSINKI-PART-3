
const Filter = ({ searchTerm, setSearchTerm }) => {
    return (
      <div>
        <div>
          Search:
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
    );
  };
  
  export default Filter;
  