import React from 'react';
import { Button } from '@mui/material';
import { supabase } from '../supabase';

const VerifyEmail = () => {
  const resend = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.auth.resend({ type: 'signup' });
      alert('Verification email resent!');
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Please verify your email 📧</h2>
      <p>Check your inbox and click the verification link to continue.</p>
      <Button onClick={resend} variant="outlined">Resend Email</Button>
    </div>
  );
};

export default VerifyEmail;
