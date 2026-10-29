import { Link, useNavigate } from 'react-router-dom';
import SearchInput from './SearchInput.jsx';
import Avatar from './Avatar.jsx';
import Logo from './Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="site-header">
      <nav className="site-header__inner" aria-label="Main navigation">
        <Link to="/home" className="site-header__logo">
          <Link to="/home" className="site-header__logo">
            <Logo />
          </Link>
        </Link>

        <SearchInput className="site-header__search" />

        <div className="site-header__actions">
          <Link to="/create-post" className="site-header__add" aria-label="Create a new post">
            +
          </Link>
          {user?.isAdmin && (
            <Link to="/admin" className="btn btn-ghost site-header__admin-link">
              admin
            </Link>
          )}
          {user && (
            <Link to={`/profile/${user._id}`} className="site-header__avatar-link" aria-label="Go to your profile">
              <Avatar user={user} className="site-header__avatar" />
            </Link>
          )}
          <button type="button" className="btn btn-ghost" onClick={handleLogout}>
            log out
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Header;
