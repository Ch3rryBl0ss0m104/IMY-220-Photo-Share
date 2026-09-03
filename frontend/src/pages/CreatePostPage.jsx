import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import CreatePost from '../components/CreatePost.jsx';
import { currentUser } from '../data/dummyData.js';
import './CreatePostPage.css';

function CreatePostPage() {
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate(`/profile/${currentUser.id}`);
  };

  return (
    <div className="page">
      <Header />
      <main className="create-post-page">
        <h2>share something new</h2>
        <CreatePost onCreate={handleCreate} />
      </main>
    </div>
  );
}

export default CreatePostPage;
