import { Link } from 'react-router-dom';
import { getUserById } from '../data/dummyData.js';
import './PostPreview.css';

function timeAgo(isoDate) {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const hours = Math.max(1, Math.round(diffMs / (1000 * 60 * 60)));
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

function PostPreview({ post, variant = 'feed' }) {
  const author = getUserById(post.authorId);
  const visibleComments = post.comments.slice(0, 2);

  if (variant === 'grid') {
    return (
      <Link to={`/post/${post.id}`} className="post-preview post-preview--grid">
        <div className="post-preview__thumb" style={{ background: post.imageColor }} />
        <span className="post-preview__grid-caption">{post.caption}</span>
      </Link>
    );
  }

  return (
    <article className="post-preview">
      <header className="post-preview__header">
        <span className="post-preview__avatar" style={{ background: author?.avatarColor }} />
        <div>
          <Link to={`/profile/${author?.id}`} className="post-preview__author">
            {author?.name}
          </Link>
          <p className="post-preview__time">{timeAgo(post.createdAt)}</p>
        </div>
      </header>

      <Link to={`/post/${post.id}`} className="post-preview__image" style={{ background: post.imageColor }}>
        <span className="visually-hidden">View post</span>
      </Link>

      <p className="post-preview__caption">{post.caption}</p>

      {post.hashtags.length > 0 && (
        <ul className="post-preview__hashtags">
          {post.hashtags.map((tag) => (
            <li key={tag} className="pill-tag">
              {tag}
            </li>
          ))}
        </ul>
      )}

      <div className="post-preview__actions">
        <button type="button" className="btn btn-secondary">
          like
        </button>
        <button type="button" className="btn btn-secondary">
          comment
        </button>
        <button type="button" className="btn btn-secondary">
          report
        </button>
      </div>

      {visibleComments.length > 0 && (
        <ul className="post-preview__comments">
          {visibleComments.map((comment) => {
            const commenter = getUserById(comment.authorId);
            return (
              <li key={comment.id}>
                <strong>{commenter?.name}</strong> {comment.text}
              </li>
            );
          })}
          {post.comments.length > visibleComments.length && (
            <li>
              <Link to={`/post/${post.id}`} className="post-preview__view-all">
                view all {post.comments.length} comments →
              </Link>
            </li>
          )}
        </ul>
      )}
    </article>
  );
}

export default PostPreview;
