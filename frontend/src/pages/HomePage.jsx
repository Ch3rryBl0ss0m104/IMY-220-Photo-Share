import { useMemo, useState } from 'react';
import Header from '../components/Header.jsx';
import Feed from '../components/Feed.jsx';
import { posts, currentUser } from '../data/dummyData.js';
import './HomePage.css';

const SORT_OPTIONS = [
  { value: 'newest', label: 'newest' },
  { value: 'mostCommented', label: 'most commented' },
];

function HomePage() {
  const [feedType, setFeedType] = useState('local');
  const [sortBy, setSortBy] = useState('newest');

  const visiblePosts = useMemo(() => {
    let filtered = posts;
    if (feedType === 'local') {
      const friendIds = new Set([...currentUser.friends, currentUser.id]);
      filtered = posts.filter((post) => friendIds.has(post.authorId));
    }

    const sorted = [...filtered];
    if (sortBy === 'newest') {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'mostCommented') {
      sorted.sort((a, b) => b.comments.length - a.comments.length);
    }
    return sorted;
  }, [feedType, sortBy]);

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

        <Feed posts={visiblePosts} />
      </main>
    </div>
  );
}

export default HomePage;
