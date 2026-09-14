import { useState } from 'react';
import * as albumsApi from '../api/albums.js';
import './CreatePost.css';

function CreateAlbum({ onCreate }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim()) {
      setError('An album name is required.');
      return;
    }

    setStatus('loading');
    setError('');
    try {
      const { album } = await albumsApi.createAlbum({
        name,
        description,
        hashtags: hashtags.split(' ').map((tag) => tag.trim()).filter(Boolean),
      });
      setName('');
      setDescription('');
      setHashtags('');
      setStatus('idle');
      onCreate?.(album);
    } catch (err) {
      console.error('Album creation failed:', err);
      setError(err.message || 'Could not create album.');
      setStatus('error');
    }
  };

  return (
    <form className="create-post" onSubmit={handleSubmit}>
      <h3>new album</h3>

      <div className="create-post__field">
        <label htmlFor="album-name">name</label>
        <input id="album-name" type="text" value={name} onChange={(event) => setName(event.target.value)} />
      </div>

      <div className="create-post__field">
        <label htmlFor="album-description">description</label>
        <textarea
          id="album-description"
          rows={2}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>

      <div className="create-post__field">
        <label htmlFor="album-hashtags">hashtags</label>
        <input
          id="album-hashtags"
          type="text"
          placeholder="#roadtrip #summer"
          value={hashtags}
          onChange={(event) => setHashtags(event.target.value)}
        />
      </div>

      {error && <p className="create-post__error">{error}</p>}

      <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
        {status === 'loading' ? 'creating…' : 'create album'}
      </button>
    </form>
  );
}

export default CreateAlbum;
