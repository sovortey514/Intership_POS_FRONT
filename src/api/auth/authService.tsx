import axios from "axios";

import type { SignUpRequest, SignUpResponse, SignInRequest, SignInResponse  } from "./authTypes";


const BASE_URL = "http://localhost:9090"; // Update your backend URL

export async function signUp(data: SignUpRequest): Promise<SignUpResponse> {
  try {
    const response = await axios.post(`${BASE_URL}/auth/signup`, data);
    return response.data;
  } catch (error) {
    return {
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || "An error occurred",
    };
  }
}

export async function signIn(data: SignInRequest): Promise<SignInResponse> {
  try {
    const response = await axios.post(`${BASE_URL}/auth/signin`, data, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data; // Return the response data (including JWT and refresh token)
  } catch (error) {
    // Ensure that the returned object matches the SignInResponse type
    return {
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || "An error occurred",
      token: "", // Empty token when error occurs
      refreshToken: "", // Empty refreshToken when error occurs
      expirationTime: "", 
      // Empty expirationTime when error occurs
    };
  }
}