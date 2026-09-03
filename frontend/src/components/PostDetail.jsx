import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserById, albums } from '../data/dummyData.js';
import PostImage from './PostImage.jsx';
import EditPostForm from './EditPostForm.jsx';
import './PostDetail.css';

function PostDetail({ post, isOwner, children }) {
  const [isEditing, setIsEditing] = useState(false);
  const [caption, setCaption] = useState(post.caption);
  const [hashtags, setHashtags] = useState(post.hashtags);
  const author = getUserById(post.authorId);
  const parentAlbum = albums.find((album) => album.postIds.includes(post.id));

  const handleSave = (updated) => {
    setCaption(updated.caption);
    setHashtags(updated.hashtags);
    setIsEditing(false);
  };

  return (
    <div className="post-detail">
      <div className="post-detail__main">
        <PostImage color={post.imageColor} alt={caption} />

        <div className="post-detail__meta">
          <span className="post-detail__avatar" style={{ background: author?.avatarColor }} />
          <div>
            <Link to={`/profile/${author?.id}`} className="post-detail__author">
              {author?.name}
            </Link>
            <p className="post-detail__time">1 day ago</p>
          </div>
        </div>

        {isEditing ? (
          <EditPostForm post={{ caption, hashtags }} onSave={handleSave} onCancel={() => setIsEditing(false)} />
        ) : (
          <>
            <p className="post-detail__caption">{caption}</p>
            {hashtags.length > 0 && (
              <ul className="post-detail__hashtags">
                {hashtags.map((tag) => (
                  <li key={tag} className="pill-tag">
                    {tag}
                  </li>
                ))}
              </ul>
            )}
            {isOwner && (
              <div className="post-detail__owner-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(true)}>
                  edit description / hashtags
                </button>
                <button type="button" className="btn btn-secondary post-detail__delete">
                  delete post
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <aside className="post-detail__aside">
        {parentAlbum && (
          <Link to={`/album/${parentAlbum.id}`} className="post-detail__album-card">
            <span className="post-detail__album-thumb" style={{ background: post.imageColor }} />
            <div>
              <p className="post-detail__album-label">belongs to album</p>
              <p className="post-detail__album-name">{parentAlbum.name} →</p>
            </div>
          </Link>
        )}

        {children}

        {!isOwner && (
          <button type="button" className="btn btn-secondary post-detail__report">
            report post
          </button>
        )}
      </aside>
    </div>
  );
}

export default PostDetail;
