import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { toast } from 'react-toastify';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id);

      if (!error) setFavorites(data);
      setLoading(false);
    };

    fetchFavorites();
  }, []);

  const removeFavorite = async (movie_id) => {
    const confirm = window.confirm('Are you sure you want to remove this movie from favorites?');
    if (!confirm) return;

    const { error } = await supabase
      .from('favorites')
      .delete()
      .match({ user_id: user.id, movie_id });

    if (!error) {
      toast.success('Removed from favorites');
      setFavorites((prev) => prev.filter((m) => m.movie_id !== movie_id));
    } else {
      toast.error('Error removing favorite');
    }
  };

  return { favorites, loading, removeFavorite };
};
