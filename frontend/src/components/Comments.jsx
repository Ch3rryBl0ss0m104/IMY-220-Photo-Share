import { useEffect, useState } from 'react';
import * as commentsApi from '../api/comments.js';
import './Comments.css';

function Comments({ postId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    commentsApi
      .getComments(postId)
      .then((data) => {
        if (!cancelled) setComments(data.comments);
      })
      .catch((error) => console.error('Failed to load comments:', error))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [postId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!draft.trim()) return;

    setPosting(true);
    try {
      const { comment } = await commentsApi.addComment(postId, draft.trim());
      setComments((prev) => [...prev, comment]);
      setDraft('');
    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      setPosting(false);
    }
  };

  return (
    <section className="comments">
      <h4>comments ({comments.length})</h4>

      {loading ? (
        <p className="comments__loading">loading comments…</p>
      ) : (
        <ul className="comments__list">
          {comments.map((comment) => (
            <li key={comment._id} className="comments__item">
              <span className="comments__avatar" style={{ background: comment.author?.avatarColor }} />
              <div>
                <p className="comments__author">{comment.author?.name}</p>
                <p>{comment.text}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form className="comments__form" onSubmit={handleSubmit}>
        <label htmlFor="comment-draft" className="visually-hidden">
          Add a comment
        </label>
        <input
          id="comment-draft"
          type="text"
          placeholder="add a comment…"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <button type="submit" className="btn btn-primary" disabled={posting}>
          {posting ? 'posting…' : 'post'}
        </button>
      </form>
    </section>
  );
}

export default Comments;
