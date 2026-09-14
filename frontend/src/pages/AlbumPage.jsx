import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header.jsx';
import * as albumsApi from '../api/albums.js';
import * as usersApi from '../api/users.js';
import { useAuth } from '../context/AuthContext.jsx';
import './AlbumPage.css';

function AlbumPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', description: '', hashtags: '' });
  const [ownPosts, setOwnPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState('');

  const loadAlbum = useCallback(async () => {
    setLoading(true);
    try {
      const { album: fetchedAlbum } = await albumsApi.getAlbum(id);
      setAlbum(fetchedAlbum);
      setEditData({
        name: fetchedAlbum.name,
        description: fetchedAlbum.description,
        hashtags: fetchedAlbum.hashtags.join(' '),
      });
    } catch (error) {
      console.error('Failed to load album:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadAlbum();
  }, [loadAlbum]);

  const isOwner = user && album && album.ownerId === user._id;

  useEffect(() => {
    if (isOwner) {
      usersApi
        .getUserPosts(user._id)
        .then((data) => setOwnPosts(data.posts))
        .catch((error) => console.error('Failed to load your posts:', error));
    }
  }, [isOwner, user]);

  const handleSaveEdit = async (event) => {
    event.preventDefault();
    try {
      await albumsApi.updateAlbum(id, {
        name: editData.name,
        description: editData.description,
        hashtags: editData.hashtags.split(' ').map((t) => t.trim()).filter(Boolean),
      });
      setIsEditing(false);
      loadAlbum();
    } catch (error) {
      console.error('Failed to update album:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this album? Posts inside it will not be deleted.')) return;
    try {
      await albumsApi.deleteAlbum(id);
      navigate(`/profile/${user._id}`);
    } catch (error) {
      console.error('Failed to delete album:', error);
    }
  };

  const handleRemovePost = async (postId) => {
    try {
      await albumsApi.removePostFromAlbum(id, postId);
      loadAlbum();
    } catch (error) {
      console.error('Failed to remove post from album:', error);
    }
  };

  const handleAddPost = async (event) => {
    event.preventDefault();
    if (!selectedPostId) return;
    try {
      await albumsApi.addPostToAlbum(id, selectedPostId);
      setSelectedPostId('');
      loadAlbum();
    } catch (error) {
      console.error('Failed to add post to album:', error);
    }
  };

  if (loading || !album) {
    return (
      <div className="page">
        <Header />
        <main className="album-page">
          <p>loading album…</p>
        </main>
      </div>
    );
  }

  const postsNotInAlbum = ownPosts.filter((post) => !album.posts.some((p) => p._id === post._id));

  return (
    <div className="page">
      <Header />
      <main className="album-page">
        {isEditing ? (
          <form className="album-page__edit-form" onSubmit={handleSaveEdit}>
            <div className="album-page__edit-field">
              <label htmlFor="album-edit-name">name</label>
              <input
                id="album-edit-name"
                type="text"
                value={editData.name}
                onChange={(e) => setEditData((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="album-page__edit-field">
              <label htmlFor="album-edit-description">description</label>
              <textarea
                id="album-edit-description"
                rows={2}
                value={editData.description}
                onChange={(e) => setEditData((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="album-page__edit-field">
              <label htmlFor="album-edit-hashtags">hashtags</label>
              <input
                id="album-edit-hashtags"
                type="text"
                value={editData.hashtags}
                onChange={(e) => setEditData((prev) => ({ ...prev, hashtags: e.target.value }))}
              />
            </div>
            <div className="album-page__edit-actions">
              <button type="submit" className="btn btn-primary">
                save changes
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="album-page__header">
            <div>
              <h2>{album.name}</h2>
              <p>{album.description}</p>
              <ul className="album-page__hashtags">
                {album.hashtags.map((tag) => (
                  <li key={tag} className="pill-tag">
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
            {isOwner && (
              <div className="album-page__actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(true)}>
                  edit
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleDelete}>
                  delete
                </button>
              </div>
            )}
          </div>
        )}

        {isOwner && postsNotInAlbum.length > 0 && (
          <form className="album-page__add-post" onSubmit={handleAddPost}>
            <label htmlFor="add-existing-post">add one of your posts to this album</label>
            <div className="album-page__add-post-row">
              <select id="add-existing-post" value={selectedPostId} onChange={(e) => setSelectedPostId(e.target.value)}>
                <option value="">choose a post…</option>
                {postsNotInAlbum.map((post) => (
                  <option key={post._id} value={post._id}>
                    {post.caption.slice(0, 40)}
                  </option>
                ))}
              </select>
              <button type="submit" className="btn btn-secondary">
                add
              </button>
            </div>
          </form>
        )}

        <p className="album-page__count">posts in this album ({album.posts.length})</p>

        {album.posts.length === 0 ? (
          <p className="posts-grid__empty">No posts in this album yet.</p>
        ) : (
          <div className="posts-grid">
            {album.posts.map((post) => (
              <div key={post._id} className="album-page__post-card">
                <Link to={`/post/${post._id}`}>
                  <img className="post-preview__thumb" src={post.image} alt={post.caption} />
                </Link>
                {isOwner && (
                  <button type="button" className="album-page__remove-btn" onClick={() => handleRemovePost(post._id)}>
                    remove
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default AlbumPage;
