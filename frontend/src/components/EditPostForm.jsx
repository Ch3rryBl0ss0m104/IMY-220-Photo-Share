import { useState } from 'react';
import './EditPostForm.css';

function EditPostForm({ post, onSave, onCancel }) {
  const [caption, setCaption] = useState(post.caption);
  const [hashtags, setHashtags] = useState(post.hashtags.join(' '));

  const handleSubmit = (event) => {
    event.preventDefault();
    const updated = {
      caption,
      hashtags: hashtags.split(' ').map((tag) => tag.trim()).filter(Boolean),
    };
    console.log('Post update (dummy submit):', updated);
    onSave?.(updated);
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

      <div className="edit-post-form__actions">
        <button type="submit" className="btn btn-primary">
          save changes
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          cancel
        </button>
      </div>
    </form>
  );
}

export default EditPostForm;
