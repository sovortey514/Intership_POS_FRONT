import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import { Avatar, Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { getUserById, Update } from 'src/api/auth/authService';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function UpdateformView({ userId, onUserUpdate }:{ userId: number,onUserUpdate: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null); 
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserById(userId);
        console.log('User data retrieved:', userData);
        if (userData) {
          setEmail(userData.email);
          setRole(userData.role);
        }
      } catch (err) {
        setError('Failed to load user data');
        console.error('Error fetching user data:', err);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleUpdateUser = async () => {
    setIsLoading(true);
    try {
      const updateData = { email, password, role };
      const response = await Update(userId, updateData);
      if (response.statusCode === 200) {
        setIsLoading(false);
        onUserUpdate();
      } else {
        setError(response.message || 'Failed to register');
        setIsLoading(false);
      }
    } catch (e) {
      console.error(e);
      setError('An error occurred during sign-up');
      setIsLoading(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const renderForm = (
    <Box display="flex" flexDirection="column" alignItems="flex-end" sx={{ gap: 3 }}>
      <TextField
        fullWidth
        name="email"
        label="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        required
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        name="role"
        label="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        required
        sx={{ mb: 2 }}
      />
      <TextField
  fullWidth
  name="password"
  label="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  required
  type={showPassword ? 'text' : 'password'}  
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton
          onClick={() => setShowPassword(!showPassword)}
          edge="end"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
        </IconButton>
      </InputAdornment>
    ),
  }}
  sx={{ mb: 2 }}
/>

      <Box display="flex" flexDirection="column" alignItems="center" sx={{ mb: 2, width: '100%' }}>
        <Avatar
          src={image ? URL.createObjectURL(image) : undefined}
          alt="User Avatar"
          sx={{ width: 100, height: 100, mb: 1, border: '4px solid #FF5722' }}
        />
        <Button
          variant="contained"
          component="label"
          sx={{
            backgroundColor: 'white',
            color: '#E64A19',
            border: '1px solid #E64A19',
            padding: '6px 12px',
            borderRadius: 2,
            '&:hover': {
              backgroundColor: '#E64A19',
              color: 'white',
              border: '1px solid white',
            },
          }}
        >
          Upload Image
          <input hidden accept="image/*" type="file" onChange={handleImageChange} />
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <LoadingButton
        fullWidth
        size="large"
        type="button"
        color="inherit"
        variant="contained"
        loading={isLoading}
        onClick={handleUpdateUser}
        sx={{
          backgroundColor: '#FF5722',
          '&:hover': {
            backgroundColor: '#E64A19',
          },
        }}
      >
        Update Staff
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight="bold">
        Create Staff
        </Typography>
      </Box>
      {renderForm}
    </>
  );
}
