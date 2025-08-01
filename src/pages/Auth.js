import React, { useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const insertProfile = async (user) => {
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      email: user.email,
    });
    if (error) console.error("Profile insert error", error);
  };

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Signup successful! Check your email for verification.");
      navigate('/verify');
    }
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        if (!user.email_confirmed_at) {
          toast.info("Please verify your email.");
          navigate('/verify');
          return;
        }
        await insertProfile(user);
        toast.success("Login successful!");
        navigate('/');
      }
    }
  };

  const handleResetPassword = async () => {
    if (!email) return toast.warning('Enter your email first!');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3000/update-password'
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Reset link sent to your email");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login / Signup</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br /><br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br /><br />

      <button onClick={handleLogin}>Login</button>
      <button onClick={handleSignup} style={{ marginLeft: 10 }}>Sign Up</button>
      <br /><br />
      <button onClick={handleResetPassword} style={{ color: '#007bff', background: 'none', border: 'none', cursor: 'pointer' }}>
        Forgot Password?
      </button>
    </div>
  );
};

export default Auth;
