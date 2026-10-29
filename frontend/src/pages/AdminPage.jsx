import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import PostPreview from '../components/PostPreview.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import * as adminApi from '../api/admin.js';
import * as reportReasonsApi from '../api/reportReasons.js';
import './AdminPage.css';

const TABS = [
  { key: 'reported', label: 'reported posts' },
  { key: 'reasons', label: 'report reasons' },
  { key: 'users', label: 'users' },
  { key: 'content', label: 'posts & albums' },
];

function ReportedPostsTab() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminApi
      .getReportedPosts()
      .then((data) => setPosts(data.posts))
      .catch((error) => console.error('Failed to load reported posts:', error))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDismiss = async (postId) => {
    await adminApi.dismissReports(postId);
    load();
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Delete this reported post for good?')) return;
    await adminApi.adminDeletePost(postId);
    load();
  };

  if (loading) return <p className="admin-page__status">loading reported posts…</p>;
  if (posts.length === 0) return <p className="admin-page__status">No reported posts right now.</p>;

  return (
    <div className="admin-page__reported-grid">
      {posts.map((post) => (
        <div key={post._id} className="admin-page__reported-card">
          <PostPreview post={post} />
          <div className="admin-page__reported-meta">
            <span className="pill-tag">
              reported {post.reportCount}× {post.reportCount >= 2 ? '(hidden from feed)' : ''}
            </span>
            <ul className="admin-page__reasons-list">
              {post.reportReasons.map((reason, i) => (
                <li key={`${reason}-${i}`}>{reason}</li>
              ))}
            </ul>
            <div className="admin-page__reported-actions">
              <button type="button" className="btn btn-secondary" onClick={() => handleDismiss(post._id)}>
                dismiss reports
              </button>
              <button type="button" className="profile-info__delete" onClick={() => handleDelete(post._id)}>
                delete post
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ReportReasonsTab() {
  const [reasons, setReasons] = useState([]);
  const [newLabel, setNewLabel] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    reportReasonsApi
      .getReportReasons()
      .then((data) => setReasons(data.reasons))
      .catch((error) => console.error('Failed to load reasons:', error))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (event) => {
    event.preventDefault();
    if (!newLabel.trim()) return;
    const { reason } = await adminApi.addReportReason(newLabel.trim());
    setReasons((prev) => [...prev, reason]);
    setNewLabel('');
  };

  const handleRemove = async (id) => {
    await adminApi.deleteReportReason(id);
    setReasons((prev) => prev.filter((reason) => reason._id !== id));
  };

  if (loading) return <p className="admin-page__status">loading report reasons…</p>;

  return (
    <div className="admin-page__reasons">
      <form className="admin-page__add-reason" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="new report reason, e.g. 'Misleading'"
          value={newLabel}
          onChange={(event) => setNewLabel(event.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          add reason
        </button>
      </form>
      <ul className="admin-page__reasons-manage-list">
        {reasons.map((reason) => (
          <li key={reason._id}>
            <span className="pill-tag">{reason.label}</span>
            <button type="button" className="profile-info__delete" onClick={() => handleRemove(reason._id)}>
              remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminApi
      .getAllUsersAdmin()
      .then((data) => setUsers(data.users))
      .catch((error) => console.error('Failed to load users:', error))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (userId) => {
    if (!window.confirm('Delete this account? This cannot be undone.')) return;
    await adminApi.adminDeleteUser(userId);
    load();
  };

  if (loading) return <p className="admin-page__status">loading users…</p>;

  return (
    <ul className="admin-page__users-list">
      {users.map((u) => (
        <li key={u._id}>
          <Link to={`/profile/${u._id}`}>
            {u.name} <span className="admin-page__username">@{u.username}</span>
          </Link>
          {u.isAdmin && <span className="pill-tag">admin</span>}
          <button type="button" className="profile-info__delete" onClick={() => handleDelete(u._id)}>
            delete account
          </button>
        </li>
      ))}
    </ul>
  );
}

function ContentTab() {
  const [posts, setPosts] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([adminApi.getAllPostsAdmin(), adminApi.getAllAlbumsAdmin()])
      .then(([postsData, albumsData]) => {
        setPosts(postsData.posts);
        setAlbums(albumsData.albums);
      })
      .catch((error) => console.error('Failed to load content:', error))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Delete this post?')) return;
    await adminApi.adminDeletePost(postId);
    load();
  };

  const handleDeleteAlbum = async (albumId) => {
    if (!window.confirm('Delete this album?')) return;
    await adminApi.adminDeleteAlbum(albumId);
    load();
  };

  if (loading) return <p className="admin-page__status">loading content…</p>;

  return (
    <div className="admin-page__content">
      <section>
        <h3>all posts ({posts.length})</h3>
        <ul className="admin-page__content-list">
          {posts.map((post) => (
            <li key={post._id}>
              <Link to={`/post/${post._id}`}>{post.caption}</Link>
              <span className="admin-page__username">by {post.author?.name}</span>
              <button type="button" className="profile-info__delete" onClick={() => handleDeletePost(post._id)}>
                delete
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3>all albums ({albums.length})</h3>
        <ul className="admin-page__content-list">
          {albums.map((album) => (
            <li key={album._id}>
              <Link to={`/album/${album._id}`}>{album.name}</Link>
              <button type="button" className="profile-info__delete" onClick={() => handleDeleteAlbum(album._id)}>
                delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState('reported');

  if (authLoading) return <div className="auth-loading">loading…</div>;
  if (!user?.isAdmin) return <Navigate to="/home" replace />;

  return (
    <div className="page">
      <Header />
      <main className="admin-page">
        <h1>admin</h1>

        <div className="admin-page__tabs" role="tablist">
          {TABS.map((item) => (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={tab === item.key}
              className={tab === item.key ? 'admin-page__tab is-active' : 'admin-page__tab'}
              onClick={() => setTab(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === 'reported' && <ReportedPostsTab />}
        {tab === 'reasons' && <ReportReasonsTab />}
        {tab === 'users' && <UsersTab />}
        {tab === 'content' && <ContentTab />}
      </main>
    </div>
  );
}

export default AdminPage;
