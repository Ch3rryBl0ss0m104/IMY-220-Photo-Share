import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import ProfilePreview from '../components/ProfilePreview.jsx';
import PostPreview from '../components/PostPreview.jsx';
import * as searchApi from '../api/search.js';
import './SearchPage.css';

const TABS = [
  { key: 'all', label: 'all' },
  { key: 'users', label: 'people' },
  { key: 'posts', label: 'posts' },
  { key: 'albums', label: 'albums' },
];

function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState({ users: [], posts: [], albums: [] });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    searchApi
      .search(query)
      .then((data) => {
        if (!cancelled) setResults(data);
      })
      .catch((error) => console.error('Search failed:', error))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [query]);

  const totalCount = results.users.length + results.posts.length + results.albums.length;
  const showUsers = tab === 'all' || tab === 'users';
  const showPosts = tab === 'all' || tab === 'posts';
  const showAlbums = tab === 'all' || tab === 'albums';

  return (
    <div className="page">
      <Header />
      <main className="search-page">
        <h1 className="search-page__heading">
          results for <span className="search-page__query">"{query}"</span>
        </h1>

        <div className="search-page__tabs" role="tablist">
          {TABS.map((item) => (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={tab === item.key}
              className={tab === item.key ? 'search-page__tab is-active' : 'search-page__tab'}
              onClick={() => setTab(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="search-page__status">searching…</p>
        ) : totalCount === 0 ? (
          <p className="search-page__status">No results for "{query}". Try a different name, caption, or #hashtag.</p>
        ) : (
          <>
            {showUsers && results.users.length > 0 && (
              <section className="search-page__section">
                <h2>people</h2>
                <div className="search-page__users">
                  {results.users.map((user) => (
                    <ProfilePreview key={user._id} user={user} />
                  ))}
                </div>
              </section>
            )}

            {showAlbums && results.albums.length > 0 && (
              <section className="search-page__section">
                <h2>albums</h2>
                <ul className="search-page__albums">
                  {results.albums.map((album) => (
                    <li key={album._id}>
                      <Link to={`/album/${album._id}`} className="search-page__album-link">
                        <strong>{album.name}</strong>
                        <span>{album.description}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {showPosts && results.posts.length > 0 && (
              <section className="search-page__section">
                <h2>posts</h2>
                <div className="search-page__posts">
                  {results.posts.map((post) => (
                    <PostPreview key={post._id} post={post} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default SearchPage;
