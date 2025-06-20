
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
  phone?: string;
}

export interface CreateUserResponse {
  error?: string;
  success?: boolean;
  message?: string;
}
