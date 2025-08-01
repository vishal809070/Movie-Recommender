import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { toast } from 'react-toastify';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  const handleAddToFavorites = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return toast.error("Please login first.");

    const { error } = await supabase.from('favorites').insert([{
      user_id: user.id,
      movie_id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average
    }]);

    if (!error) toast.success('❤️ Added to Favorites!');
    else toast.error('Already in Favorites or failed');
  };

  const handleAddToWatchlist = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return toast.error("Please login first.");

    const { error } = await supabase.from('watchlist').insert([{
      user_id: user.id,
      movie_id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average
    }]);

    if (!error) toast.success('📺 Added to Watchlist!');
    else toast.error('Already in Watchlist or failed');
  };

  return (
    <div className="movie-card" style={{ width: 200, margin: 10 }}>
      <img
        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
        alt={movie.title}
        onClick={() => navigate(`/movie/${movie.id}`)}
        style={{ cursor: 'pointer', borderRadius: 8 }}
      />
      <h4 style={{ marginTop: 8 }}>{movie.title}</h4>
      <p>⭐ {movie.vote_average}</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={handleAddToFavorites}>❤️ Favorite</button>
        <button onClick={handleAddToWatchlist}>📺 Watchlist</button>
      </div>
    </div>
  );
};

export default MovieCard;
