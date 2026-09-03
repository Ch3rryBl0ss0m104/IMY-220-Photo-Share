import { useState } from 'react';
import './SearchInput.css';

function SearchInput({ className = '' }) {
  const [term, setTerm] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Search functionality is implemented in a later deliverable.
    console.log('Search submitted for:', term);
  };

  return (
    <form className={`search-input ${className}`} onSubmit={handleSubmit} role="search">
      <label htmlFor="search-term" className="visually-hidden">
        Search photos, people, or hashtags
      </label>
      <input
        id="search-term"
        type="text"
        placeholder="search photos, people, #tags"
        value={term}
        onChange={(event) => setTerm(event.target.value)}
      />
    </form>
  );
}

export default SearchInput;
