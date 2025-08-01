import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Avatar, Button, TextField, Typography } from '@mui/material';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) {
        setName(data.name || '');
        setAvatarUrl(data.avatar_url || '');
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    let newAvatarUrl = avatarUrl;

    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) return alert('Upload failed!');

      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
      newAvatarUrl = urlData.publicUrl;
    }

    const { error } = await supabase
      .from('profiles')
      .update({ name, avatar_url: newAvatarUrl })
      .eq('id', user.id);

    if (!error) alert('Profile updated!');
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4">Profile</Typography>
      <Avatar src={avatarUrl} sx={{ width: 100, height: 100, marginTop: 2 }} />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <TextField
        label="Name"
        fullWidth
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button variant="contained" onClick={handleSave}>
        Save Changes
      </Button>
    </div>
  );
};

export default Profile;
