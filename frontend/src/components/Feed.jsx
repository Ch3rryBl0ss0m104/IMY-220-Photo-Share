import PostPreview from './PostPreview.jsx';
import './Feed.css';

function Feed({ posts }) {
  if (posts.length === 0) {
    return <p className="feed__empty">No activity to show yet.</p>;
  }

  return (
    <div className="feed">
      {posts.map((post) => (
        <PostPreview key={post.id} post={post} />
      ))}
    </div>
  );
}

export default Feed;
