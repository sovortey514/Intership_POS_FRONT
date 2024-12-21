import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { useRouter } from 'src/routes/hooks';
import { signIn } from 'src/api/auth/authService';
import { Iconify } from 'src/components/iconify';

export function SignInView() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignin = async () => {
    setIsLoading(true);
    try {
      const signInData = { email, password };
      const response = await signIn(signInData);
      
      // Check if sign-in was successful (statusCode 200)
      if (response.statusCode === 200) {
        // Store JWT token in localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);

        // Redirect to the home page after successful login
        router.push('/');
      } else {
        setError(response.message || 'Failed to sign in');
      }
    } catch (e) {
      setError('An error occurred during sign-in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = useCallback(() => {
    router.push('/sign-up');
  }, [router]);

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Sign in</Typography>
        <Typography variant="body2" color="text.secondary">
          Don’t have an account?
          <Link variant="subtitle2" sx={{ ml: 0.5 }} onClick={handleCreateAccount}>
            Create new account
          </Link>
        </Typography>
      </Box>

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
          sx={{ mb: 3 }}
        />

        {/* Error Message */}
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
          onClick={handleSignin}
        >
          Sign In
        </LoadingButton>
      </Box>

      <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}>
          OR
        </Typography>
      </Divider>

      <Box gap={1} display="flex" justifyContent="center">
        <IconButton color="inherit">
          <Iconify icon="logos:google-icon" />
        </IconButton>
      </Box>
    </>
  );
}
