// src/components/GenreRow.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography } from '@mui/material';
import MovieCard from './MovieCard';

const GenreRow = ({ genre }) => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchGenreMovies = async () => {
      try {
        const res = await axios.get(`https://api.themoviedb.org/3/discover/movie`, {
          params: {
            api_key: process.env.REACT_APP_TMDB_KEY,
            with_genres: genre.id,
            sort_by: 'popularity.desc',
          },
        });
        setMovies(res.data.results);
      } catch (err) {
        console.error('Failed to load genre movies', err);
      }
    };

    fetchGenreMovies();
  }, [genre.id]);

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 1 }}>{genre.name}</Typography>
      <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </Box>
    </Box>
  );
};

export default GenreRow;
