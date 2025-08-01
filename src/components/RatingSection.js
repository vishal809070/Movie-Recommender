// src/components/RatingSection.js
import React, { useEffect, useState } from 'react';
import { Box, Typography, Rating } from '@mui/material';
import { supabase } from '../supabase';
import { toast } from 'react-toastify';

const RatingSection = ({ movieId }) => {
  const [user, setUser] = useState(null);
  const [myRating, setMyRating] = useState(0);
  const [avg, setAvg] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const { data: userData } = await supabase.auth.getUser();
      setUser(userData?.user || null);

      const { data: userRating } = await supabase
        .from('ratings')
        .select('*')
        .eq('user_id', userData?.user?.id)
        .eq('movie_id', movieId)
        .single();

      if (userRating) setMyRating(userRating.rating);

      const { data: allRatings } = await supabase
        .from('ratings')
        .select('rating')
        .eq('movie_id', movieId);

      const avgRating = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length || 0;
      setAvg(avgRating.toFixed(1));
    };

    fetch();
  }, [movieId]);

  const handleRate = async (_, newRating) => {
    setMyRating(newRating);
    const { error } = await supabase
      .from('ratings')
      .upsert({ user_id: user.id, movie_id: movieId, rating: newRating });
    if (!error) toast.success('Rated!');
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6">Ratings</Typography>
      <Rating value={myRating} onChange={handleRate} />
      {avg && <Typography variant="body2">Avg Rating: {avg} / 5</Typography>}
    </Box>
  );
};

export default RatingSection;
