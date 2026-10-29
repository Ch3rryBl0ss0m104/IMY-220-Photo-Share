import Avatar from './Avatar.jsx';
import './ProfileInfo.css';

const STATUS_LABELS = {
  friends: 'friends',
  outgoing: 'request sent',
  incoming: 'wants to be friends',
  none: 'not friends',
};

function ProfileInfo({
  user,
  isOwnProfile,
  friendshipStatus,
  onEdit,
  onDeleteAccount,
  onSendRequest,
  onAcceptRequest,
  onDeclineRequest,
  onUnfriend,
}) {
  return (
    <section className="profile-info">
      <Avatar user={user} className="profile-info__avatar" />

      <div className="profile-info__details">
        <h2>
          {isOwnProfile ? 'Me' : user.name} <span className="profile-info__username">@{user.username}</span>
        </h2>
        <p className="profile-info__bio">{user.bio}</p>
        {user.links?.length > 0 && (
          <ul className="profile-info__links">
            {user.links.map((link) => (
              <li key={link} className="pill-tag">
                {link}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="profile-info__aside">
        {isOwnProfile ? (
          <>
            <button type="button" className="btn btn-secondary" onClick={onEdit}>
              edit profile
            </button>
            <button type="button" className="profile-info__delete" onClick={onDeleteAccount}>
              delete account
            </button>
          </>
        ) : (
          <>
            <span className="pill-tag profile-info__status">{STATUS_LABELS[friendshipStatus]}</span>

            {friendshipStatus === 'none' && (
              <button type="button" className="btn btn-secondary" onClick={onSendRequest}>
                add friend
              </button>
            )}

            {friendshipStatus === 'incoming' && (
              <div className="profile-info__request-actions">
                <button type="button" className="btn btn-secondary" onClick={onAcceptRequest}>
                  accept
                </button>
                <button type="button" className="profile-info__delete" onClick={onDeclineRequest}>
                  decline
                </button>
              </div>
            )}

            {friendshipStatus === 'friends' && (
              <button type="button" className="profile-info__delete" onClick={onUnfriend}>
                unfriend
              </button>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default ProfileInfo;
