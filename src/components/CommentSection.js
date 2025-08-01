import React, { useEffect, useState } from 'react';
import {
  Box, TextField, Button, Avatar, Typography, IconButton, Card, CardHeader, CardContent, Stack
} from '@mui/material';
import { ThumbUp, ThumbDown, Delete } from '@mui/icons-material';
import { supabase } from '../supabase';

const CommentSection = ({ movieId }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [user, setUser] = useState(null);
  const [profiles, setProfiles] = useState({});

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('movie_id', movieId)
        .order('created_at', { ascending: false });

      if (!error) setComments(data);
    };

    const fetchProfiles = async () => {
      const { data } = await supabase.from('profiles').select('id, email');
      const profileMap = {};
      data?.forEach(p => { profileMap[p.id] = p.email; });
      setProfiles(profileMap);
    };

    fetchComments();
    fetchProfiles();
  }, [movieId]);

  const handleAddComment = async () => {
    if (!text.trim()) return;

    const { data, error } = await supabase.from('comments').insert([{
      text,
      movie_id: movieId,
      user_id: user.id,
      likes: 0,
      dislikes: 0,
    }]);

    if (!error) {
      setText('');
      setComments(prev => [data[0], ...prev]);
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('comments').delete().eq('id', id);
    if (!error) setComments(prev => prev.filter(c => c.id !== id));
  };

  const handleReaction = async (id, type) => {
    const column = type === 'like' ? 'likes' : 'dislikes';
    const {  error } = await supabase.rpc('increment_reaction', {
      row_id: id,
      column_name: column
    });

    if (!error) {
      setComments(prev => prev.map(c => c.id === id ? { ...c, [column]: c[column] + 1 } : c));
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>Comments</Typography>

      {user && (
        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <Avatar>{user.email[0].toUpperCase()}</Avatar>
          <TextField
            fullWidth
            variant="outlined"
            label="Add a comment"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button variant="contained" onClick={handleAddComment}>Post</Button>
        </Box>
      )}

      <Stack spacing={2}>
        {comments.map(comment => (
          <Card key={comment.id}>
            <CardHeader
              avatar={<Avatar>{profiles[comment.user_id]?.[0].toUpperCase() || '?'}</Avatar>}
              title={profiles[comment.user_id] || 'Anonymous'}
              subheader={new Date(comment.created_at).toLocaleString()}
              action={user?.id === comment.user_id && (
                <IconButton onClick={() => handleDelete(comment.id)}>
                  <Delete />
                </IconButton>
              )}
            />
            <CardContent>
              <Typography>{comment.text}</Typography>
              <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                <IconButton onClick={() => handleReaction(comment.id, 'like')}><ThumbUp fontSize="small" /></IconButton>
                <Typography variant="body2">{comment.likes}</Typography>
                <IconButton onClick={() => handleReaction(comment.id, 'dislike')}><ThumbDown fontSize="small" /></IconButton>
                <Typography variant="body2">{comment.dislikes}</Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default CommentSection;
