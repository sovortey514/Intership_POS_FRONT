import { useState } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function SignupView() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      // Implement sign-up logic here (e.g., API call)
      console.log({ email, password });
      // Simulate success and navigate
      setTimeout(() => {
        setIsLoading(false);
        router.push('/');
      }, 2000);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      px={3}
      py={5}
      maxWidth={400}
      mx="auto"
    >
      {/* Header */}
      <Box textAlign="center" mb={3}>
        <Typography variant="h5" mb={1}>
          Sign up
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Already have an account?
          <Link variant="subtitle2" sx={{ ml: 0.5 }} onClick={() => router.push('/login')}>
            Sign In
          </Link>
        </Typography>
      </Box>

      {/* Form */}
      <Box component="form" display="flex" flexDirection="column" gap={3} width="100%">
        <TextField
          fullWidth
          name="email"
          label="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />

        <TextField
          fullWidth
          name="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type={showPassword ? 'text' : 'password'}
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
        />

        <LoadingButton
          fullWidth
          size="large"
          type="button"
          color="primary"
          variant="contained"
          loading={isLoading}
          onClick={handleSignUp}
        >
          Sign Up
        </LoadingButton>
      </Box>

      {/* Divider */}
      <Divider sx={{ my: 4, width: '100%', '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}>
          OR
        </Typography>
      </Divider>

      {/* Social Signup */}
      <Box display="flex" justifyContent="center" gap={2}>
        <IconButton color="inherit">
          <Iconify icon="logos:google-icon" />
        </IconButton>
        {/* Add more social buttons here */}
      </Box>
    </Box>
  );
}
