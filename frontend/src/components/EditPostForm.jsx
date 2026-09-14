import { useState } from 'react';
import * as postsApi from '../api/posts.js';
import './EditPostForm.css';

function EditPostForm({ post, onSave, onCancel }) {
  const [caption, setCaption] = useState(post.caption);
  const [hashtags, setHashtags] = useState(post.hashtags.join(' '));
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('loading');
    setError('');
    try {
      const { post: updatedPost } = await postsApi.updatePost(post._id, {
        caption,
        hashtags: hashtags.split(' ').map((tag) => tag.trim()).filter(Boolean),
      });
      onSave?.(updatedPost);
    } catch (err) {
      console.error('Post update failed:', err);
      setError(err.message || 'Could not update post.');
      setStatus('error');
    }
  };

  return (
    <form className="edit-post-form" onSubmit={handleSubmit}>
      <h4>edit description / hashtags</h4>

      <div className="edit-post-form__field">
        <label htmlFor="edit-caption">description</label>
        <textarea id="edit-caption" rows={3} value={caption} onChange={(event) => setCaption(event.target.value)} />
      </div>

      <div className="edit-post-form__field">
        <label htmlFor="edit-hashtags">hashtags</label>
        <input id="edit-hashtags" type="text" value={hashtags} onChange={(event) => setHashtags(event.target.value)} />
      </div>

      {error && <p className="create-post__error">{error}</p>}

      <div className="edit-post-form__actions">
        <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
          {status === 'loading' ? 'saving…' : 'save changes'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          cancel
        </button>
      </div>
    </form>
  );
}

export default EditPostForm;
