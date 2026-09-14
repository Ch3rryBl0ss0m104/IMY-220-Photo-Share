import './PostImage.css';

function PostImage({ src, alt }) {
  return <img className="post-image" src={src} alt={alt} />;
}

export default PostImage;
