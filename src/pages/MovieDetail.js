import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, Button, Grid, Chip, Divider,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import TrailerModal from '../components/TrailerModal';
import Recommendations from '../components/Recommendations';
import CastList from '../components/CastList';
import CommentSection from '../components/CommentSection';
import RatingSection from '../components/RatingSection';
import { supabase } from '../supabase';
import {
  addToFavorites, removeFromFavorites,
  addToWatchlist, removeFromWatchlist,
  isFavorite, isInWatchlist
} from '../utils/userActions';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [cast, setCast] = useState([]);
  const [inFavorites, setInFavorites] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [userId, setUserId] = useState(null);

  const fetchMovie = useCallback(async () => {
    try {
      const res = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`);
      setMovie(res.data);
    } catch (err) {
      console.error('Error fetching movie:', err);
    }
  }, [id]);

  const fetchTrailer = useCallback(async () => {
    try {
      const res = await axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`);
      const trailer = res.data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
      setTrailerKey(trailer?.key || null);
    } catch (err) {
      console.error('Error fetching trailer:', err);
    }
  }, [id]);

  const fetchCast = useCallback(async () => {
    try {
      const res = await axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`);
      setCast(res.data.cast.slice(0, 10));
    } catch (err) {
      console.error('Error fetching cast:', err);
    }
  }, [id]);

  const checkUserActions = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserId(user.id);
      const [fav, watch] = await Promise.all([
        isFavorite(user.id, id),
        isInWatchlist(user.id, id)
      ]);
      setInFavorites(fav);
      setInWatchlist(watch);
    }
  }, [id]);

  const toggleFavorites = async () => {
    if (!userId) return;
    if (inFavorites) {
      await removeFromFavorites(userId, id);
      setInFavorites(false);
    } else {
      await addToFavorites(userId, id, movie);
      setInFavorites(true);
    }
  };

  const toggleWatchlist = async () => {
    if (!userId) return;
    if (inWatchlist) {
      await removeFromWatchlist(userId, id);
      setInWatchlist(false);
    } else {
      await addToWatchlist(userId, id, movie);
      setInWatchlist(true);
    }
  };

  useEffect(() => {
    fetchMovie();
    fetchTrailer();
    fetchCast();
    checkUserActions();
  }, [fetchMovie, fetchTrailer, fetchCast, checkUserActions]);

  if (!movie) return <Typography variant="h6" textAlign="center">Loading...</Typography>;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            style={{ width: '100%', borderRadius: 8 }}
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom>{movie.title}</Typography>
          <Typography variant="body1" paragraph>{movie.overview}</Typography>
          <Typography variant="body2"><strong>Release Date:</strong> {movie.release_date}</Typography>
          <Typography variant="body2"><strong>Rating:</strong> ⭐ {movie.vote_average}</Typography>
          <Box sx={{ my: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {movie.genres?.map(g => <Chip key={g.id} label={g.name} />)}
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button variant="contained" color="primary" onClick={() => setShowTrailer(true)}>
              Watch Trailer
            </Button>
            <Button variant="outlined" color={inFavorites ? 'secondary' : 'inherit'} onClick={toggleFavorites}>
              {inFavorites ? 'Remove from Favorites' : 'Add to Favorites'}
            </Button>
            <Button variant="outlined" color={inWatchlist ? 'secondary' : 'inherit'} onClick={toggleWatchlist}>
              {inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
            </Button>
          </Box>
        </Grid>
      </Grid>

      <TrailerModal open={showTrailer} onClose={() => setShowTrailer(false)} videoKey={trailerKey} />

      <Box sx={{ mt: 5 }}>
        <Divider><Typography variant="h6">Cast</Typography></Divider>
        <CastList cast={cast} />
      </Box>

      <Box sx={{ mt: 5 }}>
        <Divider><Typography variant="h6">Comments</Typography></Divider>
        <CommentSection movieId={id} />
      </Box>

      <Box sx={{ mt: 5 }}>
        <Divider><Typography variant="h6">Ratings</Typography></Divider>
        <RatingSection movieId={id} />
      </Box>

      <Box sx={{ mt: 5 }}>
        <Divider><Typography variant="h6">Recommended</Typography></Divider>
        <Recommendations movieId={id} />
      </Box>
    </Box>
  );
};

export default MovieDetail;
