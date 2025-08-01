import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const UpdatePassword = () => {
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getSessionFromUrl = async () => {
      const { error } = await supabase.auth.getSessionFromUrl({ storeSession: true });
      if (error) {
        toast.error('Session error');
        navigate('/auth');
      }
    };
    getSessionFromUrl();
  }, [navigate]);

  const handleSubmit = async () => {
    if (!password) return toast.warning("Please enter a new password");

    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated! You can now login.");
      navigate('/');
    }
    setSubmitting(false);
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Reset Password</h2>
      <input
        type="password"
        placeholder="Enter new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br /><br />
      <button onClick={handleSubmit} disabled={submitting}>
        {submitting ? 'Updating...' : 'Update Password'}
      </button>
    </div>
  );
};

export default UpdatePassword;
