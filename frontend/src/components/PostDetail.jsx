import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PostImage from './PostImage.jsx';
import EditPostForm from './EditPostForm.jsx';
import * as postsApi from '../api/posts.js';
import './PostDetail.css';

const REPORT_REASONS = ['Spam', 'Inappropriate content', 'Harassment', 'Copyright violation', 'Other'];

function PostDetail({ post, isOwner, children, onDeleted }) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [caption, setCaption] = useState(post.caption);
  const [hashtags, setHashtags] = useState(post.hashtags);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState(REPORT_REASONS[0]);
  const [reportStatus, setReportStatus] = useState('idle');

  const handleSave = (updated) => {
    setCaption(updated.caption);
    setHashtags(updated.hashtags);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post? This also deletes its comments.')) return;
    try {
      await postsApi.deletePost(post._id);
      onDeleted?.();
      navigate(`/profile/${post.author?._id}`);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleReport = async (event) => {
    event.preventDefault();
    setReportStatus('loading');
    try {
      await postsApi.reportPost(post._id, reportReason);
      setReportStatus('done');
    } catch (error) {
      console.error('Report failed:', error);
      setReportStatus('error');
    }
  };

  return (
    <div className="post-detail">
      <div className="post-detail__main">
        <PostImage src={post.image} alt={caption} />

        <div className="post-detail__meta">
          <span className="post-detail__avatar" style={{ background: post.author?.avatarColor }} />
          <div>
            <Link to={`/profile/${post.author?._id}`} className="post-detail__author">
              {post.author?.name}
            </Link>
          </div>
        </div>

        {isEditing ? (
          <EditPostForm post={{ _id: post._id, caption, hashtags }} onSave={handleSave} onCancel={() => setIsEditing(false)} />
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
                <button type="button" className="btn btn-secondary post-detail__delete" onClick={handleDelete}>
                  delete post
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <aside className="post-detail__aside">
        {children}

        {!isOwner && (
          <div className="post-detail__report-box">
            {!reportOpen ? (
              <button type="button" className="btn btn-secondary post-detail__report" onClick={() => setReportOpen(true)}>
                report post
              </button>
            ) : reportStatus === 'done' ? (
              <p className="post-detail__report-done">Thanks — this post has been reported.</p>
            ) : (
              <form className="post-detail__report-form" onSubmit={handleReport}>
                <label htmlFor="report-reason">reason</label>
                <select id="report-reason" value={reportReason} onChange={(event) => setReportReason(event.target.value)}>
                  {REPORT_REASONS.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
                <button type="submit" className="btn btn-primary" disabled={reportStatus === 'loading'}>
                  {reportStatus === 'loading' ? 'submitting…' : 'submit report'}
                </button>
              </form>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}

export default PostDetail;
