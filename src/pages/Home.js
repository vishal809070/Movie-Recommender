import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Card, CardMedia, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [trending, setTrending] = useState([]);

  const fetchSection = async (url, setter) => {
    try {
      const res = await axios.get(`https://api.themoviedb.org/3${url}`, {
        params: { api_key: process.env.REACT_APP_TMDB_API_KEY },
      });
      setter(res.data.results || []);
    } catch (err) {
      console.error(`Error loading ${url}:`, err);
    }
  };

  useEffect(() => {
    fetchSection('/movie/popular', setPopular);
    fetchSection('/movie/top_rated', setTopRated);
    fetchSection('/trending/movie/day', setTrending);
  }, []);

  const renderCarousel = (title, movies) => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>{title}</Typography>
      <Box sx={{
        display: 'flex',
        overflowX: 'auto',
        gap: 2,
        pb: 1,
        '&::-webkit-scrollbar': { height: 6 },
        '&::-webkit-scrollbar-thumb': { background: '#888', borderRadius: 4 }
      }}>
        {movies.map(movie => (
          <Link key={movie.id} to={`/movie/${movie.id}`} style={{ textDecoration: 'none' }}>
            <Card sx={{ minWidth: 140 }}>
              <CardMedia
                component="img"
                height="200"
                image={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
              />
              <CardContent sx={{ p: 1 }}>
                <Typography variant="body2" noWrap>{movie.title}</Typography>
              </CardContent>
            </Card>
          </Link>
        ))}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      {renderCarousel('🔥 Trending Today', trending)}
      {renderCarousel('🌟 Popular Movies', popular)}
      {renderCarousel('🏆 Top Rated', topRated)}
    </Box>
  );
};

export default Home;
