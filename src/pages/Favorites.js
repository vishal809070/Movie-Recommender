import React from 'react';
import { useNavigate } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { useFavorites } from '../hooks/useFavorites';

const Favorites = () => {
  const { favorites, loading, removeFavorite } = useFavorites();
  const navigate = useNavigate();

  if (loading) return <p>Loading your favorites...</p>;

  if (!favorites) {
    navigate('/auth');
    return <p>Please login to view favorites.</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Your Favorite Movies ❤️</h2>
      {favorites.length > 0 ? (
        <div className="movie-grid">
          {favorites.map((movie) => (
            <div key={movie.movie_id} style={{ position: 'relative' }}>
              <MovieCard movie={movie} />
              <button
                onClick={() => removeFavorite(movie.movie_id)}
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  background: 'red',
                  color: '#fff',
                  border: 'none',
                  padding: '4px 8px',
                  cursor: 'pointer',
                  borderRadius: '4px',
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>You haven’t added any favorites yet.</p>
      )}
    </div>
  );
};

export default Favorites;
