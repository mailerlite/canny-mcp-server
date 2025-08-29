import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { CONFIG } from '../config/config.js';

export interface CannyApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

export interface CannyPost {
  id: string;
  title: string;
  details?: string;
  status: string;
  author: {
    id: string;
    name: string;
    email?: string;
  };
  board: {
    id: string;
    name: string;
  };
  category?: {
    id: string;
    name: string;
  };
  tags: Array<{
    id: string;
    name: string;
  }>;
  votes: number;
  score: number;
  createdAt: string;
  updatedAt: string;
  url: string;
}

export interface CannyBoard {
  id: string;
  name: string;
  url: string;
  postCount: number;
  isPrivate: boolean;
  token: string;
}
