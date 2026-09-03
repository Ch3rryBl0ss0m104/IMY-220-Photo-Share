import { Routes, Route } from 'react-router-dom';
import SplashPage from './pages/SplashPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import PostPage from './pages/PostPage.jsx';
import CreatePostPage from './pages/CreatePostPage.jsx';
import AlbumPage from './pages/AlbumPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/profile/:id" element={<ProfilePage />} />
      <Route path="/post/:id" element={<PostPage />} />
      <Route path="/album/:id" element={<AlbumPage />} />
      <Route path="/create-post" element={<CreatePostPage />} />
      <Route path="*" element={<SplashPage />} />
    </Routes>
  );
}

export default App;
