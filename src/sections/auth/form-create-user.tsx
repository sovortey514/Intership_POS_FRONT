import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';
import { signUp } from 'src/api/auth/authService';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function CreateView() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // For capturing error messages

  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      const signUpData = { email, password, role }; // Include role if necessary
      const response = await signUp(signUpData);
      if (response.statusCode === 200) {
        setIsLoading(false);
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

  const renderForm = (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      <TextField
        fullWidth
        name="email"
        label="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        required
        sx={{ mb: 3 }}
      />
      <TextField
        fullWidth
        name="role"
        label="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        required
        sx={{ mb: 3 }}
      />

      <TextField
        fullWidth
        name="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
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
        sx={{ mb: 3 }}
      />
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
        onClick={handleSignUp}
      >
        Create Staff
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Create Staff</Typography>
      </Box>

      {renderForm}
    </>
  );
}
