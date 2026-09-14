import { useState } from 'react';
import * as postsApi from '../api/posts.js';
import './CreatePost.css';

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function CreatePost({ onCreate }) {
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageName, setImageName] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!imageFile || !caption.trim()) {
      setError('A photo and description are both required.');
      return;
    }

    setStatus('loading');
    setError('');
    try {
      const image = await fileToDataUrl(imageFile);
      const { post } = await postsApi.createPost({
        image,
        caption,
        hashtags: hashtags
          .split(' ')
          .map((tag) => tag.trim())
          .filter(Boolean),
      });

      setCaption('');
      setHashtags('');
      setImageFile(null);
      setImageName('');
      setStatus('idle');
      onCreate?.(post);
    } catch (err) {
      console.error('Post creation failed:', err);
      setError(err.message || 'Could not create post.');
      setStatus('error');
    }
  };

  return (
    <form className="create-post" onSubmit={handleSubmit}>
      <h3>new post</h3>

      <div className="create-post__field">
        <label htmlFor="post-image">photo</label>
        <input
          id="post-image"
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0] || null;
            setImageFile(file);
            setImageName(file?.name || '');
          }}
        />
        {imageName && <p className="create-post__filename">{imageName}</p>}
      </div>

      <div className="create-post__field">
        <label htmlFor="post-caption">description</label>
        <textarea
          id="post-caption"
          rows={3}
          placeholder="Say something about this photo…"
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
        />
      </div>

      <div className="create-post__field">
        <label htmlFor="post-hashtags">hashtags</label>
        <input
          id="post-hashtags"
          type="text"
          placeholder="#picnicday #sunshine"
          value={hashtags}
          onChange={(event) => setHashtags(event.target.value)}
        />
      </div>

      {error && <p className="create-post__error">{error}</p>}

      <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
        {status === 'loading' ? 'sharing…' : 'share post'}
      </button>
    </form>
  );
}

export default CreatePost;
