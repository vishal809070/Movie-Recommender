import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Chip, CircularProgress, Grid,
  FormControl, InputLabel, Select, MenuItem, Button
} from '@mui/material';
import MovieCard from '../components/MovieCard';

const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;

const TVGenres = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [shows, setShows] = useState([]);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchGenres = async () => {
      const res = await fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${TMDB_API_KEY}&language=en-US`);
      const data = await res.json();
      setGenres(data.genres);
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchShows = async () => {
      if (selectedGenres.length === 0) {
        setShows([]);
        return;
      }

      setLoading(true);
      const genreString = selectedGenres.join(',');
      const res = await fetch(
        `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_genres=${genreString}&sort_by=${sortBy}&page=${page}`
      );
      const data = await res.json();
      setShows(data.results);
      setLoading(false);
    };

    fetchShows();
    window.scrollTo(0, 0);
  }, [selectedGenres, sortBy, page]);

  const toggleGenre = (id) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
    setPage(1);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Browse TV Shows by Genres</Typography>

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
            setPage(1);
          }}
        >
          <MenuItem value="popularity.desc">Popularity</MenuItem>
          <MenuItem value="first_air_date.desc">First Air Date</MenuItem>
          <MenuItem value="vote_average.desc">Rating</MenuItem>
        </Select>
      </FormControl>

      {/* Show Results */}
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {shows.map((show) => (
            <Grid item key={show.id} xs={12} sm={6} md={4} lg={3}>
              <MovieCard movie={show} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      {shows.length > 0 && (
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

export default TVGenres;
