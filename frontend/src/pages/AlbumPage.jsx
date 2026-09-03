import { useParams } from 'react-router-dom';
import Header from '../components/Header.jsx';
import PostsGrid from '../components/PostsGrid.jsx';
import { albums, posts } from '../data/dummyData.js';
import './AlbumPage.css';

function AlbumPage() {
  const { id } = useParams();
  const album = albums.find((item) => item.id === id) || albums[0];
  const albumPosts = posts.filter((post) => album.postIds.includes(post.id));

  return (
    <div className="page">
      <Header />
      <main className="album-page">
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
          <div className="album-page__actions">
            <button type="button" className="btn btn-secondary">
              edit
            </button>
            <button type="button" className="btn btn-secondary">
              delete
            </button>
          </div>
        </div>

        <p className="album-page__count">posts in this album ({albumPosts.length})</p>
        <PostsGrid posts={albumPosts} emptyLabel="No posts in this album yet." />
      </main>
    </div>
  );
}

export default AlbumPage;
