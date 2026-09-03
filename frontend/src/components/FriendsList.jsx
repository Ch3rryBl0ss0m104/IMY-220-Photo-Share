import ProfilePreview from './ProfilePreview.jsx';
import './FriendsList.css';

function FriendsList({ friends, label = 'friends' }) {
  return (
    <section className="friends-list">
      <h4>{label}</h4>
      {friends.length === 0 ? (
        <p className="friends-list__empty">No friends to show.</p>
      ) : (
        <div className="friends-list__row">
          {friends.map((friend) => (
            <ProfilePreview key={friend.id} user={friend} />
          ))}
        </div>
      )}
    </section>
  );
}

export default FriendsList;
