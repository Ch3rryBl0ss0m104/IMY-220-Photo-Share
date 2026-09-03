import './ProfileInfo.css';

function ProfileInfo({ user, isOwnProfile, friendshipStatus, onEdit, onDeleteAccount }) {
  return (
    <section className="profile-info">
      <span className="profile-info__avatar" style={{ background: user.avatarColor }} />

      <div className="profile-info__details">
        <h2>
          {isOwnProfile ? 'Me' : user.name} <span className="profile-info__username">@{user.username}</span>
        </h2>
        <p className="profile-info__bio">{user.bio}</p>
        {user.links.length > 0 && (
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
            <span className="pill-tag profile-info__status">{friendshipStatus}</span>
            {friendshipStatus === 'friends' && (
              <button type="button" className="profile-info__delete">
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
