import { Routes, Route } from 'react-router-dom';
import SplashPage from './pages/SplashPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import PostPage from './pages/PostPage.jsx';
import CreatePostPage from './pages/CreatePostPage.jsx';
import AlbumPage from './pages/AlbumPage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import RequireAuth from './components/RequireAuth.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashPage />} />
      <Route path="/login" element={<SplashPage initialMode="login" />} />
      <Route path="/signup" element={<SplashPage initialMode="signup" />} />

      <Route
        path="/home"
        element={
          <RequireAuth>
            <HomePage />
          </RequireAuth>
        }
      />
      <Route
        path="/profile/:id"
        element={
          <RequireAuth>
            <ProfilePage />
          </RequireAuth>
        }
      />
      <Route
        path="/post/:id"
        element={
          <RequireAuth>
            <PostPage />
          </RequireAuth>
        }
      />
      <Route
        path="/album/:id"
        element={
          <RequireAuth>
            <AlbumPage />
          </RequireAuth>
        }
      />
      <Route
        path="/create-post"
        element={
          <RequireAuth>
            <CreatePostPage />
          </RequireAuth>
        }
      />
      <Route
        path="/search"
        element={
          <RequireAuth>
            <SearchPage />
          </RequireAuth>
        }
      />
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <AdminPage />
          </RequireAuth>
        }
      />

      <Route path="*" element={<SplashPage />} />
    </Routes>
  );
}

export default App;
