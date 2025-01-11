import axios from 'axios';

import type {
  Alluser,
  SignInRequest,
  SignUpRequest,
  UpdateRequest,
  SignInResponse,
  SignUpResponse,
} from './authTypes';

const BASE_URL = 'http://localhost:9090'; // Ensure this matches your backend's base URL

export async function signUp(
  signUpData: SignUpRequest,
  imageFile: File | null // Allow null if no image is uploaded
): Promise<SignUpResponse> {
  try {
    // Sign-Up Request
    const signUpResponse = await axios.post<SignUpResponse>(`${BASE_URL}/auth/signup`, signUpData, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (signUpResponse.status === 200) {
      const userId = signUpResponse.data.ourUsers?.id;

      // Check if userId exists
      if (!userId) {
        throw new Error('User ID is missing in the response');
      }

      // Handle image upload if an image file is provided
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('userId', userId.toString());

        const uploadImageResponse = await axios.post(`${BASE_URL}/auth/upload_image`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (uploadImageResponse.status !== 200) {
          throw new Error('Image upload failed');
        }
      }

      return {
        statusCode: 200,
        message: 'Sign-up successful and image uploaded.',
        id: userId,
      };
    }

    return {
      statusCode: 400,
      message: 'Sign-up failed.',
    };
  } catch (error: any) {
    console.error('Error during sign-up or image upload:', error);
    return {
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || 'An error occurred during sign-up or image upload.',
    };
  }
}
// Sign-in function
export async function signIn(data: SignInRequest): Promise<SignInResponse> {
  try {
    const response = await axios.post<SignInResponse>(`${BASE_URL}/auth/signin`, data);
    return response.data;
  } catch (error: any) {
    return {
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || 'An error occurred during sign-in',
      token: '',
      refreshToken: '',
      expirationTime: '',
    } as SignInResponse;
  }
}

export async function GetallUsers(): Promise<Alluser[]> {
  try {
    const response = await axios.get<Alluser[]>(`${BASE_URL}/auth/users`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching users:', error);
    throw new Error(error.response?.data?.message || 'An error occurred while fetching users');
  }
}

export async function GetallUserswithimage(): Promise<Alluser[]> {
  try {
    const response = await axios.get<Alluser[]>(`${BASE_URL}/auth/get_all_user_with_images`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching users:', error);
    throw new Error(error.response?.data?.message || 'An error occurred while fetching users');
  }
}

export async function deleteUser(userId: number): Promise<void> {
  try {
    const response = await axios.delete(`${BASE_URL}/auth/users/${userId}`);
    if (response.status === 200) {
      console.log(`User with ID ${userId} deleted successfully.`);
    }
  } catch (error: any) {
    console.error('Error deleting user:', error);
    throw new Error(error.response?.data?.message || 'An error occurred while deleting the user');
  }
}






export async function disableUser(userId: number, data: UpdateRequest ): Promise<void> {
  try {
    const response = await axios.put(`${BASE_URL}/auth/users/${userId}/disable`,data);
    if (response.status === 200) {
      console.log(`User with ID ${userId} disabled successfully.`);
    }
  } catch (error: any) {
    console.error('Error disabling user:', error);
    throw new Error(error.response?.data?.message || 'An error occurred while disabling the user');
  }
}

export async function enableUser(userId: number, data: UpdateRequest): Promise<void> {
  try {
    const response = await axios.put(`${BASE_URL}/auth/users/${userId}/enable`,data);
    if (response.status === 200) {
      console.log(`User with ID ${userId} enabled successfully.`);
    }
  } catch (error: any) {
    console.error('Error enabling user:', error);
    throw new Error(error.response?.data?.message || 'An error occurred while enabling the user');
  }
}

export async function getUserById(userId: number): Promise<Alluser | null> {
  try {
    const response = await axios.get<Alluser>(`${BASE_URL}/auth/users/${userId}`);
    console.log('Response data:', response.data); 
    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch (error: any) {
    console.error('Error fetching user by ID:', error);
    throw new Error(error.response?.data?.message || 'An error occurred while fetching the user by ID');
  }
}


export async function Update(data: SignUpRequest): Promise<SignUpResponse> {
  try {
    const response = await axios.post<SignUpResponse>(`${BASE_URL}/auth/signup`, data, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data; // Return the response data from the server
  } catch (error: any) {
    // Handle errors gracefully and return a consistent response format
    return {
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || 'An error occurred during sign-up',
    } as SignUpResponse;
  }
}
