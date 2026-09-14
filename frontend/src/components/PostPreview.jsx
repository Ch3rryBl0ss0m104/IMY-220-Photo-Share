import { Link } from 'react-router-dom';
import './PostPreview.css';

function timeAgo(isoDate) {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const hours = Math.max(1, Math.round(diffMs / (1000 * 60 * 60)));
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

function PostPreview({ post, variant = 'feed' }) {
  const postId = post._id;

  if (variant === 'grid') {
    return (
      <Link to={`/post/${postId}`} className="post-preview post-preview--grid">
        <img className="post-preview__thumb" src={post.image} alt={post.caption} />
        <span className="post-preview__grid-caption">{post.caption}</span>
      </Link>
    );
  }

  return (
    <article className="post-preview">
      <header className="post-preview__header">
        <span className="post-preview__avatar" style={{ background: post.author?.avatarColor }} />
        <div>
          <Link to={`/profile/${post.author?._id}`} className="post-preview__author">
            {post.author?.name}
          </Link>
          <p className="post-preview__time">{timeAgo(post.createdAt)}</p>
        </div>
      </header>

      <Link to={`/post/${postId}`} className="post-preview__image-link">
        <img className="post-preview__image" src={post.image} alt={post.caption} />
      </Link>

      <p className="post-preview__caption">{post.caption}</p>

      {post.hashtags?.length > 0 && (
        <ul className="post-preview__hashtags">
          {post.hashtags.map((tag) => (
            <li key={tag} className="pill-tag">
              {tag}
            </li>
          ))}
        </ul>
      )}

      <Link to={`/post/${postId}`} className="post-preview__view-all">
        {post.commentCount > 0 ? `view ${post.commentCount} comment${post.commentCount === 1 ? '' : 's'} →` : 'be the first to comment →'}
      </Link>
    </article>
  );
}

export default PostPreview;
