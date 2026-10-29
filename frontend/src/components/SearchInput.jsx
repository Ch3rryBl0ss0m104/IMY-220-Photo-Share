import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchInput.css';

function SearchInput({ className = '' }) {
  const navigate = useNavigate();
  const [term, setTerm] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!term.trim()) return;
    navigate(`/search?q=${encodeURIComponent(term.trim())}`);
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
