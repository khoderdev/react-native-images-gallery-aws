export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
  token: string;
}

export interface ImageData {
  id: number;
  filename: string;
  s3_key: string;
  url: string;
  signed_url?: string;
  content_type: string;
  size: number;
  created_at: string;
  updated_at: string;
  user?: {
    first_name: string;
    last_name: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface UserProfileData {
  id: number;
  first_name: string;
  last_name: string;
  created_at: string;
  images: ImageData[];
}

export interface ImageGalleryScreenProps {
  navigation: any;
}