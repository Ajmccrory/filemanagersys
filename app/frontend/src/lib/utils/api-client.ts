import axios, { AxiosError } from 'axios';
import { ApiError, ApiResponse } from '@/lib/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => {
    const apiResponse: ApiResponse<any> = {
      data: response.data,
      status: 'success',
    };
    return apiResponse;
  },
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: error.response?.data?.message || 'An unexpected error occurred',
      status: error.response?.status || 500,
    };
    throw apiError;
  }
);

export { api };