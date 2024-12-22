export * from './authService';

export interface SignUpRequest {
    email: string;
    password: string;
    role: string;
  }

  export interface SignUpResponse {
    statusCode: number;
    message: string;
    error?: string;
  }

  