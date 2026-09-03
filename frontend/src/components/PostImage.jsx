import './PostImage.css';

function PostImage({ color, alt }) {
  return <div className="post-image" style={{ background: color }} role="img" aria-label={alt} />;
}

export default PostImage;
