import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import axios from 'axios';
import { toast } from 'react-toastify';
import TrailerModal from '../components/TrailerModal';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query) return;

    const fetchResultsAndSave = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=YOUR_TMDB_API_KEY`
        );
        setResults(res.data.results);
      } catch (err) {
        toast.error('Failed to fetch results');
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('recent_searches').insert([
            {
              user_id: user.id,
              search_query: query,
            },
          ]);
          fetchRecentSearches();
        }
      } catch (err) {
        console.error('Saving search failed:', err.message);
      }
    };

    fetchResultsAndSave();
  }, [query]);

  const fetchRecentSearches = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('recent_searches')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    setRecentSearches(data);
  };

  const handleOpenTrailer = async (movieId) => {
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=d091d54513f0f7762031639271c2808f`
      );
      const trailer = res.data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
      if (trailer) {
        setTrailerKey(trailer.key);
        setTrailerOpen(true);
      } else {
        toast.info('No trailer found for this movie');
      }
    } catch (err) {
      toast.error('Failed to load trailer');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Search Results for: <i>{query}</i></h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        {results.map((movie) => (
          <div key={movie.id} style={{ width: 200 }}>
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
              onClick={() => navigate(`/movie/${movie.id}`)}
              style={{ cursor: 'pointer', borderRadius: 8 }}
            />
            <p>{movie.title}</p>
            <button onClick={() => handleOpenTrailer(movie.id)}>▶️ Watch Trailer</button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 30 }}>
        <h3>Recent Searches</h3>
        <ul>
          {recentSearches.map((item, idx) => (
            <li key={idx}>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'blue',
                  cursor: 'pointer',
                  fontSize: 16,
                }}
                onClick={() =>
                  navigate(`/search?q=${encodeURIComponent(item.search_query)}`)
                }
              >
                {item.search_query}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <TrailerModal
        open={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        videoKey={trailerKey}
      />
    </div>
  );
};

export default Search;
