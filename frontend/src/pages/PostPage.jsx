import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header.jsx';
import PostDetail from '../components/PostDetail.jsx';
import Comments from '../components/Comments.jsx';
import * as postsApi from '../api/posts.js';
import { useAuth } from '../context/AuthContext.jsx';
import './PostPage.css';

function PostPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    postsApi
      .getPost(id)
      .then((data) => {
        if (!cancelled) setPost(data.post);
      })
      .catch((error) => console.error('Failed to load post:', error))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading || !post) {
    return (
      <div className="page">
        <Header />
        <main className="post-page">
          <p>loading post…</p>
        </main>
      </div>
    );
  }

  const isOwner = post.author?._id === user?._id;

  return (
    <div className="page">
      <Header />
      <main className="post-page">
        <PostDetail post={post} isOwner={isOwner}>
          <Comments postId={post._id} />
        </PostDetail>
      </main>
    </div>
  );
}

export default PostPage;
