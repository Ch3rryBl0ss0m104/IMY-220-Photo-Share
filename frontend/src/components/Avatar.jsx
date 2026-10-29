import './Avatar.css';

// Shared avatar renderer: shows the user's uploaded profile picture if they have one, otherwise falls back to the plain colour swatch every user starts with.
function Avatar({ user, className = '' }) {
  if (user?.avatarImage) {
    return <img className={`avatar ${className}`} src={user.avatarImage} alt="" />;
  }
  return <span className={`avatar avatar--color ${className}`} style={{ background: user?.avatarColor }} />;
}

export default Avatar;
