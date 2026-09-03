import PostPreview from './PostPreview.jsx';
import './PostsGrid.css';

function PostsGrid({ posts, emptyLabel = 'No posts yet.' }) {
  if (posts.length === 0) {
    return <p className="posts-grid__empty">{emptyLabel}</p>;
  }

  return (
    <div className="posts-grid">
      {posts.map((post) => (
        <PostPreview key={post.id} post={post} variant="grid" />
      ))}
    </div>
  );
}

export default PostsGrid;
