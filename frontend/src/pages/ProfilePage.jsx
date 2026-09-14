import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import ProfileInfo from '../components/ProfileInfo.jsx';
import EditProfileForm from '../components/EditProfileForm.jsx';
import FriendsList from '../components/FriendsList.jsx';
import PostsGrid from '../components/PostsGrid.jsx';
import CreatePost from '../components/CreatePost.jsx';
import CreateAlbum from '../components/CreateAlbum.jsx';
import * as usersApi from '../api/users.js';
import { useAuth } from '../context/AuthContext.jsx';
import './ProfilePage.css';

function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, refreshUser, logout } = useAuth();

  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateAlbum, setShowCreateAlbum] = useState(false);

  const isOwnProfile = currentUser?._id === id;

  const loadProfile = useCallback(async () => {
    setLoading(true);
    try {
      const [userRes, postsRes, albumsRes] = await Promise.all([
        usersApi.getUser(id),
        usersApi.getUserPosts(id),
        usersApi.getUserAlbums(id),
      ]);
      setProfileUser(userRes.user);
      setPosts(postsRes.posts);
      setAlbums(albumsRes.albums);

      // Friends are only fetched (and only meaningful to show) for your own profile or a friend's profile
      const isFriend = currentUser?.friends?.includes(id);
      if (currentUser?._id === id || isFriend) {
        const friendsRes = await usersApi.getUserFriends(id);
        setFriends(friendsRes.friends);
      } else {
        setFriends([]);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  }, [id, currentUser]);

  useEffect(() => {
    loadProfile();
    setIsEditing(false);
    setTab('posts');
  }, [loadProfile]);

  const friendshipStatus = (() => {
    if (!currentUser || isOwnProfile) return 'self';
    if (currentUser.friends?.includes(id)) return 'friends';
    if (currentUser.friendRequestsOutgoing?.includes(id)) return 'outgoing';
    if (currentUser.friendRequestsIncoming?.includes(id)) return 'incoming';
    return 'none';
  })();

  const handleSendRequest = async () => {
    await usersApi.sendFriendRequest(id);
    await refreshUser();
  };

  const handleAcceptRequest = async () => {
    await usersApi.acceptFriendRequest(id);
    await refreshUser();
    loadProfile();
  };

  const handleDeclineRequest = async () => {
    await usersApi.declineFriendRequest(id);
    await refreshUser();
  };

  const handleUnfriend = async () => {
    await usersApi.unfriend(id);
    await refreshUser();
    loadProfile();
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Delete your account? This cannot be undone.')) return;
    await usersApi.deleteUser(id);
    await logout();
    navigate('/');
  };

  const canSeeFriends = friendshipStatus === 'self' || friendshipStatus === 'friends';

  if (loading || !profileUser) {
    return (
      <div className="page">
        <Header />
        <main className="profile-page">
          <p>loading profile…</p>
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      <Header />
      <main className="profile-page">
        {isEditing ? (
          <EditProfileForm
            user={profileUser}
            onCancel={() => setIsEditing(false)}
            onSave={(updatedUser) => {
              setProfileUser(updatedUser);
              setIsEditing(false);
              refreshUser();
            }}
          />
        ) : (
          <ProfileInfo
            user={profileUser}
            isOwnProfile={isOwnProfile}
            friendshipStatus={friendshipStatus}
            onEdit={() => setIsEditing(true)}
            onDeleteAccount={handleDeleteAccount}
            onSendRequest={handleSendRequest}
            onAcceptRequest={handleAcceptRequest}
            onDeclineRequest={handleDeclineRequest}
            onUnfriend={handleUnfriend}
          />
        )}

        {canSeeFriends && <FriendsList friends={friends} label={isOwnProfile ? 'your friends' : 'friends'} />}

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
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowCreatePost((prev) => !prev);
                  setShowCreateAlbum(false);
                }}
              >
                new post
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowCreateAlbum((prev) => !prev);
                  setShowCreatePost(false);
                }}
              >
                new album
              </button>
            </div>
          )}
        </div>

        {showCreatePost && (
          <CreatePost
            onCreate={(post) => {
              setPosts((prev) => [post, ...prev]);
              setShowCreatePost(false);
            }}
          />
        )}
        {showCreateAlbum && (
          <CreateAlbum
            onCreate={(album) => {
              setAlbums((prev) => [album, ...prev]);
              setShowCreateAlbum(false);
            }}
          />
        )}

        {tab === 'posts' ? (
          <PostsGrid posts={posts} emptyLabel="No posts yet." />
        ) : (
          <ul className="profile-page__albums">
            {albums.length === 0 && <p className="posts-grid__empty">No albums yet.</p>}
            {albums.map((album) => (
              <li key={album._id} className="profile-page__album-card">
                <Link to={`/album/${album._id}`} className="profile-page__album-link">
                  <span className="profile-page__album-thumb" />
                  <div>
                    <p className="profile-page__album-name">{album.name}</p>
                    <p className="profile-page__album-desc">{album.description}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

export default ProfilePage;
