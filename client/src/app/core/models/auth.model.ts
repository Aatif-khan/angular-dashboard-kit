export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  avatar?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}
