import { Link } from 'react-router-dom';
import Avatar from './Avatar.jsx';
import './ProfilePreview.css';

function ProfilePreview({ user }) {
  return (
    <Link to={`/profile/${user._id}`} className="profile-preview">
      <Avatar user={user} className="profile-preview__avatar" />
      <span className="profile-preview__name">{user.name}</span>
    </Link>
  );
}

export default ProfilePreview;
