import { Link, useNavigate } from 'react-router-dom';
import SearchInput from './SearchInput.jsx';
import './Header.css';

function Header({ currentUserId = 'u1' }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Stubbed: no real session yet, just send the user back to the splash page.
    navigate('/');
  };

  return (
    <header className="site-header">
      <nav className="site-header__inner" aria-label="Main navigation">
        <Link to="/home" className="site-header__logo">
          Doodlr
        </Link>

        <SearchInput className="site-header__search" />

        <div className="site-header__actions">
          <Link to="/create-post" className="site-header__add" aria-label="Create a new post">
            +
          </Link>
          <Link
            to={`/profile/${currentUserId}`}
            className="site-header__avatar"
            aria-label="Go to your profile"
          />
          <button type="button" className="btn btn-ghost" onClick={handleLogout}>
            log out
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Header;
