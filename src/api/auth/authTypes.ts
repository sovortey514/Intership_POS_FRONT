export interface SignUpRequest {
    email: string;
    password: string;
    role?: string;
  }
  
  export interface SignUpResponse {
    statusCode: number;
    message: string;
    error?: string;
  }
  
  export type SignInRequest = {
    email: string;
    password: string;
  };
  
  export type SignInResponse = {
    statusCode: number;
    token: string;
    refreshToken: string;
    expirationTime: string;
    message: string;
    error?: string;
  };