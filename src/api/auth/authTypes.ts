
  
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
    userId?: number;
  }
  
  export interface SignUpResponse {
    statusCode: number;
    message: string;
    error?: string;
    imageUrl?: string;
  }

  export interface Alluser  {
    isVerified: boolean;
    avatarUrl: string;
    status: string;
    id: number;
    name: string | null;
    username: string | null;
    email: string;
    role: string;
    profileImage: string | null;
    accountNonLocked: boolean;
    credentialsNonExpired: boolean;
    accountNonExpired: boolean;
    enabled: boolean;
    authorities: { authority: string }[];
  };

