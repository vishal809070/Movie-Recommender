import React, { useEffect, useState } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Button, Box, Menu, MenuItem,
  TextField, InputAdornment, Avatar, Drawer, List, ListItem, ListItemButton, ListItemText
} from '@mui/material';
import { Brightness4, Brightness7, Search as SearchIcon, Menu as MenuIcon } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import axios from 'axios';

const Navbar = ({ onToggleTheme, darkMode }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({});
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setProfile(data);
      }
    };
    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const fetchLiveResults = async () => {
        if (search.length < 2) return setSearchResults([]);
        try {
          const res = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
            params: {
              api_key: process.env.REACT_APP_TMDB_API_KEY,
              query: search,
            },
          });
          setSearchResults(res.data.results || []);
        } catch (err) {
          console.error("Live search error", err);
          setSearchResults([]);
        }
      };
      fetchLiveResults();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
    setUserMenuAnchor(null);
    setMobileOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setSearchResults([]);
    }
  };

  const toggleMobileMenu = () => setMobileOpen(!mobileOpen);
  const openUserMenu = (e) => setUserMenuAnchor(e.currentTarget);
  const closeUserMenu = () => setUserMenuAnchor(null);

  const menuItems = [
  { text: 'Home', path: '/' },
  { text: 'Search', path: '/search' },
  { text: 'Genres', path: '/genres' }, 
  { text: 'Favorites', path: '/favorites', auth: true },
  { text: 'Profile', path: '/profile', auth: true },
  { text: 'TV Genres', path: '/tv-genres' }, 

];


  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: darkMode ? '#333' : '#1976d2' }}>
        <Toolbar sx={{ gap: 2 }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
          >
            🎬 TMDB Clone
          </Typography>

          <Box sx={{ position: 'relative', display: { xs: 'none', sm: 'block' }, width: 300 }} component="form" onSubmit={handleSearchSubmit}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search movies"
              variant="outlined"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                sx: { backgroundColor: '#fff', borderRadius: 1 },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton type="submit"><SearchIcon /></IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {searchResults?.length > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: '#fff',
                  zIndex: 10,
                  maxHeight: 300,
                  overflowY: 'auto',
                  borderRadius: 1,
                  boxShadow: 3,
                }}
              >
                {searchResults.map((movie) => (
                  <Box
                    key={movie.id}
                    onClick={() => {
                      navigate(`/movie/${movie.id}`);
                      setSearch('');
                      setSearchResults([]);
                    }}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      px: 1,
                      py: 1,
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: '#f0f0f0' }
                    }}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                      alt={movie.title}
                      style={{ width: 50, height: 75, objectFit: 'cover', borderRadius: 4, marginRight: 10 }}
                    />
                    <Typography variant="body2" noWrap>{movie.title}</Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2 }}>
            {menuItems.map((item) =>
              (!item.auth || user) && (
                <Button key={item.text} color="inherit" component={Link} to={item.path}>
                  {item.text}
                </Button>
              )
            )}
          </Box>

          <IconButton color="inherit" onClick={onToggleTheme}>
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          {user ? (
            <>
              <IconButton onClick={openUserMenu} color="inherit">
                <Avatar
                  src={profile?.avatar_url || ''}
                  sx={{ width: 32, height: 32 }}
                >
                  {user.email[0].toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu anchorEl={userMenuAnchor} open={Boolean(userMenuAnchor)} onClose={closeUserMenu}>
                <MenuItem onClick={() => { navigate('/profile'); closeUserMenu(); }}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/auth">Login</Button>
          )}

          <IconButton color="inherit" sx={{ display: { sm: 'none' } }} onClick={toggleMobileMenu}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={mobileOpen} onClose={toggleMobileMenu}>
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleMobileMenu}>
          <List>
            {menuItems.map((item) =>
              (!item.auth || user) && (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton component={Link} to={item.path}>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              )
            )}
            {user ? (
              <ListItem disablePadding>
                <ListItemButton onClick={handleLogout}>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            ) : (
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/auth">
                  <ListItemText primary="Login" />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
