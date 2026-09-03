import { Link } from 'react-router-dom';
import './ProfilePreview.css';

function ProfilePreview({ user }) {
  return (
    <Link to={`/profile/${user.id}`} className="profile-preview">
      <span className="profile-preview__avatar" style={{ background: user.avatarColor }} />
      <span className="profile-preview__name">{user.name}</span>
    </Link>
  );
}

export default ProfilePreview;
