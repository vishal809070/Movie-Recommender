import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import MovieDetail from './pages/MovieDetail';
import Auth from './pages/Auth';
import Favorites from './pages/Favorites';
import Watchlist from './pages/Watchlist'; // ✅ NEW
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './components/ProtectedRoute';
import VerifyEmail from './pages/VerifyEmail';
import Profile from './pages/Profile';
import UpdatePassword from './pages/UpdatePassword';
import Genres from './pages/Genres';
import TVGenres from './pages/TVGenres';


function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={2000} />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
        <Route path="/watchlist" element={<ProtectedRoute><Watchlist /></ProtectedRoute>} /> {/* ✅ NEW */}
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/genres" element={<Genres />} />
        <Route path="/tv-genres" element={<TVGenres />} />
      </Routes>
    </Router>
  );
}

export default App;
