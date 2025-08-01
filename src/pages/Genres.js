import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Chip, CircularProgress, Grid,
  FormControl, InputLabel, Select, MenuItem, Button
} from '@mui/material';
import MovieCard from '../components/MovieCard';

const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;

const Genres = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchGenres = async () => {
      const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`);
      const data = await res.json();
      setGenres(data.genres);
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      if (selectedGenres.length === 0) {
        setMovies([]);
        return;
      }

      setLoading(true);
      const genreString = selectedGenres.join(',');
      const res = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreString}&sort_by=${sortBy}&page=${page}`
      );
      const data = await res.json();
      setMovies(data.results);
      setLoading(false);
    };

    fetchMovies();
    window.scrollTo(0, 0); // Optional: Scroll to top on page change
  }, [selectedGenres, sortBy, page]);

  const toggleGenre = (id) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
    setPage(1); // Reset to first page on genre change
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Browse by Genres</Typography>

      {/* Genre Filter Chips */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
        {genres.map((genre) => (
          <Chip
            key={genre.id}
            label={genre.name}
            clickable
            color={selectedGenres.includes(genre.id) ? 'primary' : 'default'}
            onClick={() => toggleGenre(genre.id)}
          />
        ))}
      </Box>

      {/* Sort Dropdown */}
      <FormControl sx={{ mb: 3, minWidth: 200 }}>
        <InputLabel id="sort-label">Sort by</InputLabel>
        <Select
          labelId="sort-label"
          value={sortBy}
          label="Sort by"
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1); // Reset to page 1 on sort change
          }}
        >
          <MenuItem value="popularity.desc">Popularity</MenuItem>
          <MenuItem value="release_date.desc">Release Date</MenuItem>
          <MenuItem value="vote_average.desc">Rating</MenuItem>
        </Select>
      </FormControl>

      {/* Movie Results */}
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {movies.map((movie) => (
            <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
              <MovieCard movie={movie} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      {movies.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
          <Button variant="contained" onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
            Previous
          </Button>
          <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
            Page {page}
          </Typography>
          <Button variant="contained" onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Genres;
