import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header.jsx';
import Feed from '../components/Feed.jsx';
import * as postsApi from '../api/posts.js';
import { useAuth } from '../context/AuthContext.jsx';
import './HomePage.css';

const SORT_OPTIONS = [
  { value: 'newest', label: 'newest' },
  { value: 'mostCommented', label: 'most commented' },
];

function HomePage() {
  const { user } = useAuth();
  const [feedType, setFeedType] = useState('local');
  const [sortBy, setSortBy] = useState('newest');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    postsApi
      .getAllPosts()
      .then((data) => {
        if (!cancelled) setPosts(data.posts);
      })
      .catch((error) => console.error('Failed to load posts:', error))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const visiblePosts = useMemo(() => {
    let filtered = posts;
    if (feedType === 'local' && user) {
      const friendIds = new Set([...(user.friends || []), user._id]);
      filtered = posts.filter((post) => friendIds.has(post.authorId) || friendIds.has(post.author?._id));
    }

    const sorted = [...filtered];
    if (sortBy === 'newest') {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'mostCommented') {
      sorted.sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0));
    }
    return sorted;
  }, [posts, feedType, sortBy, user]);

  return (
    <div className="page">
      <Header />
      <main className="home-page">
        <div className="home-page__controls">
          <div className="home-page__feed-toggle" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={feedType === 'local'}
              className={feedType === 'local' ? 'home-page__toggle-btn is-active' : 'home-page__toggle-btn'}
              onClick={() => setFeedType('local')}
            >
              friends feed
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={feedType === 'global'}
              className={feedType === 'global' ? 'home-page__toggle-btn is-active' : 'home-page__toggle-btn'}
              onClick={() => setFeedType('global')}
            >
              global feed
            </button>
          </div>

          <label className="home-page__sort">
            sort:
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {loading ? <p className="home-page__loading">loading feed…</p> : <Feed posts={visiblePosts} />}
      </main>
    </div>
  );
}

export default HomePage;
