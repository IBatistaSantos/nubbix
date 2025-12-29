export interface User {
  id: string;
  name: string;
  email: string;
  accountId: string;
  role: string;
  avatar: string | null;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
