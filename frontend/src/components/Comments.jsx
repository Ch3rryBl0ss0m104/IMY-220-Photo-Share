import { useState } from 'react';
import { getUserById } from '../data/dummyData.js';
import './Comments.css';

function Comments({ comments }) {
  const [draft, setDraft] = useState('');
  const [localComments, setLocalComments] = useState(comments);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!draft.trim()) return;
    // Dummy local append - persistence lands with the backend deliverable.
    setLocalComments((prev) => [...prev, { id: `temp-${prev.length}`, authorId: 'u1', text: draft.trim() }]);
    setDraft('');
  };

  return (
    <section className="comments">
      <h4>comments ({localComments.length})</h4>

      <ul className="comments__list">
        {localComments.map((comment) => {
          const author = getUserById(comment.authorId);
          return (
            <li key={comment.id} className="comments__item">
              <span className="comments__avatar" style={{ background: author?.avatarColor }} />
              <div>
                <p className="comments__author">{author?.name}</p>
                <p>{comment.text}</p>
              </div>
            </li>
          );
        })}
      </ul>

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
        <button type="submit" className="btn btn-primary">
          post
        </button>
      </form>
    </section>
  );
}

export default Comments;
