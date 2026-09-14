import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import CreatePost from '../components/CreatePost.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import './CreatePostPage.css';

function CreatePostPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCreate = () => {
    navigate(`/profile/${user._id}`);
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
