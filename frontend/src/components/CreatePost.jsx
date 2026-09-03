import { useState } from 'react';
import './CreatePost.css';

function CreatePost({ onCreate }) {
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [imageName, setImageName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Real persistence arrives with the backend in Deliverable 2/3.
    const newPost = {
      caption,
      hashtags: hashtags
        .split(' ')
        .map((tag) => tag.trim())
        .filter(Boolean),
      imageName,
    };
    console.log('New post (dummy submit):', newPost);
    onCreate?.(newPost);
    setCaption('');
    setHashtags('');
    setImageName('');
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
          onChange={(event) => setImageName(event.target.files?.[0]?.name || '')}
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

      <button type="submit" className="btn btn-primary">
        share post
      </button>
    </form>
  );
}

export default CreatePost;
