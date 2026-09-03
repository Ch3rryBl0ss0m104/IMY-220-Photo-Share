import { useParams } from 'react-router-dom';
import Header from '../components/Header.jsx';
import PostDetail from '../components/PostDetail.jsx';
import Comments from '../components/Comments.jsx';
import { currentUser, getPostById, posts } from '../data/dummyData.js';
import './PostPage.css';

function PostPage() {
  const { id } = useParams();
  // Dynamic routing: render whichever post id is in the URL, falling back to
  // the first dummy post for now since there is no backend lookup yet.
  const post = getPostById(id) || posts[0];
  const isOwner = post.authorId === currentUser.id;

  return (
    <div className="page">
      <Header />
      <main className="post-page">
        <PostDetail post={post} isOwner={isOwner}>
          <Comments comments={post.comments} />
        </PostDetail>
      </main>
    </div>
  );
}

export default PostPage;
