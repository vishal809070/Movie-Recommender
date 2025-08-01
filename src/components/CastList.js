import React from 'react';
import {
  Grid, Card, CardMedia, CardContent, Typography, Box
} from '@mui/material';

const CastList = ({ cast }) => {
  if (!cast || cast.length === 0) return null;

  return (
    <Box mt={5}>
      <Typography variant="h6" gutterBottom>🎭 Cast</Typography>
      <Grid container spacing={2}>
        {cast.map((member) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={member.cast_id || member.id}>
            <Card sx={{ maxWidth: 180 }}>
              <CardMedia
                component="img"
                height="240"
                image={
                  member.profile_path
                    ? `https://image.tmdb.org/t/p/w300${member.profile_path}`
                    : 'https://via.placeholder.com/300x450?text=No+Image'
                }
                alt={member.name}
              />
              <CardContent>
                <Typography variant="subtitle2" noWrap>
                  {member.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  as {member.character}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CastList;
