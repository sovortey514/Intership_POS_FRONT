import axios from "axios";

import type { Alluser, SignInRequest, SignInResponse, SignUpRequest, SignUpResponse } from "./authTypes";

const BASE_URL = "http://localhost:9090"; // Ensure this matches your backend's base URL

// Sign-up function
export async function signUp(data: SignUpRequest): Promise<SignUpResponse> {
  try {
    const response = await axios.post<SignUpResponse>(`${BASE_URL}/auth/signup`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data; // Return the response data from the server
  } catch (error: any) {
    // Handle errors gracefully and return a consistent response format
    return {
      statusCode: error.response?.status || 500,
      message: error.response?.data?.message || "An error occurred during sign-up",
    } as SignUpResponse;
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
      message: error.response?.data?.message || "An error occurred during sign-in",
      token: "", 
      refreshToken: "",
      expirationTime: "",
    } as SignInResponse;
  }
}

export async function GetallUsers(): Promise<Alluser[]> {
  try {
    const response = await axios.get<Alluser[]>(`${BASE_URL}/auth/users`);
    return response.data; 
  } catch (error: any) {
    console.error("Error fetching users:", error);

    // Throw an error for the caller to handle
    throw new Error(
      error.response?.data?.message || "An error occurred while fetching users"
    );
  }
}


