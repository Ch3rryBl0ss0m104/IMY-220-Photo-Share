import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header.jsx';
import ProfileInfo from '../components/ProfileInfo.jsx';
import EditProfileForm from '../components/EditProfileForm.jsx';
import FriendsList from '../components/FriendsList.jsx';
import PostsGrid from '../components/PostsGrid.jsx';
import CreatePost from '../components/CreatePost.jsx';
import { currentUser, getUserById, getPostsByUser, getAlbumsByUser } from '../data/dummyData.js';
import './ProfilePage.css';

function ProfilePage() {
  const { id } = useParams();
  // Dynamic routing: render whichever profile id is in the URL, falling back
  // to the current user for now since there is no backend lookup yet.
  const profileUser = getUserById(id) || currentUser;
  const isOwnProfile = profileUser.id === currentUser.id;
  const isFriend = currentUser.friends.includes(profileUser.id);

  const [tab, setTab] = useState('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);

  const userPosts = getPostsByUser(profileUser.id);
  const userAlbums = getAlbumsByUser(profileUser.id);
  const friendUsers = profileUser.friends.map((friendId) => getUserById(friendId)).filter(Boolean);

  const canSeeFriends = isOwnProfile || isFriend;

  return (
    <div className="page">
      <Header />
      <main className="profile-page">
        {isEditing ? (
          <EditProfileForm user={profileUser} onCancel={() => setIsEditing(false)} onSave={() => setIsEditing(false)} />
        ) : (
          <ProfileInfo
            user={profileUser}
            isOwnProfile={isOwnProfile}
            friendshipStatus={isFriend ? 'friends' : 'not friends'}
            onEdit={() => setIsEditing(true)}
          />
        )}

        {canSeeFriends && <FriendsList friends={friendUsers} label={isOwnProfile ? 'your friends' : 'friends'} />}

        <div className="profile-page__content-header">
          <div className="profile-page__tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'posts'}
              className={tab === 'posts' ? 'home-page__toggle-btn is-active' : 'home-page__toggle-btn'}
              onClick={() => setTab('posts')}
            >
              posts
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'albums'}
              className={tab === 'albums' ? 'home-page__toggle-btn is-active' : 'home-page__toggle-btn'}
              onClick={() => setTab('albums')}
            >
              albums
            </button>
          </div>

          {isOwnProfile && (
            <div className="profile-page__owner-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowCreatePost((prev) => !prev)}>
                new post
              </button>
              <button type="button" className="btn btn-secondary">
                new album
              </button>
            </div>
          )}
        </div>

        {showCreatePost && <CreatePost onCreate={() => setShowCreatePost(false)} />}

        {tab === 'posts' ? (
          <PostsGrid posts={userPosts} emptyLabel="No posts yet." />
        ) : (
          <ul className="profile-page__albums">
            {userAlbums.length === 0 && <p className="posts-grid__empty">No albums yet.</p>}
            {userAlbums.map((album) => (
              <li key={album.id} className="profile-page__album-card">
                <span className="profile-page__album-thumb" />
                <div>
                  <p className="profile-page__album-name">{album.name}</p>
                  <p className="profile-page__album-desc">{album.description}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

export default ProfilePage;
