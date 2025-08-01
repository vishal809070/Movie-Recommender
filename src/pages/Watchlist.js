import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';

const Watchlist = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchWatchlist = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return navigate('/auth');

    const { data, error } = await supabase
      .from('watchlist')
      .select('*')
      .eq('user_id', user.id);

    if (!error) setMovies(data);
  };

  fetchWatchlist();
}, [navigate]); // ✅ Add navigate here


  const handleRemove = async (movie_id) => {
    const { error } = await supabase
      .from('watchlist')
      .delete()
      .match({ movie_id });

    if (!error) {
      setMovies(movies.filter(m => m.movie_id !== movie_id));
      alert('Removed from Watchlist');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📺 Your Watchlist</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {movies.map(movie => (
          <div key={movie.movie_id}>
            <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
            <h4>{movie.title}</h4>
            <p>⭐ {movie.vote_average}</p>
            <button onClick={() => handleRemove(movie.movie_id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watchlist;
