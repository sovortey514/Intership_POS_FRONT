
  
  export interface SignInRequest  {
    email: string;
    password: string;
    role: string;
  };
  
  export interface SignInResponse  {
    statusCode: number;
    token: string;
    refreshToken: string;
    expirationTime: string;
    message: string;
    error?: string;
  };

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