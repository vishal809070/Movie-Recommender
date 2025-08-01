import { supabase } from '../supabase';

export const isFavorite = async (userId, movieId) => {
  const { data } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', userId)
    .eq('movie_id', movieId);
  return data?.length > 0;
};

export const isInWatchlist = async (userId, movieId) => {
  const { data } = await supabase
    .from('watchlist')
    .select('*')
    .eq('user_id', userId)
    .eq('movie_id', movieId);
  return data?.length > 0;
};

export const addToFavorites = async (userId, movieId, movie) => {
  await supabase.from('favorites').insert([
    {
      user_id: userId,
      movie_id: movieId,
      title: movie.title,
      poster_path: movie.poster_path,
    },
  ]);
};

export const removeFromFavorites = async (userId, movieId) => {
  await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('movie_id', movieId);
};

export const addToWatchlist = async (userId, movieId, movie) => {
  await supabase.from('watchlist').insert([
    {
      user_id: userId,
      movie_id: movieId,
      title: movie.title,
      poster_path: movie.poster_path,
    },
  ]);
};

export const removeFromWatchlist = async (userId, movieId) => {
  await supabase
    .from('watchlist')
    .delete()
    .eq('user_id', userId)
    .eq('movie_id', movieId);
};
