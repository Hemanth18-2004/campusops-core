export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "faculty" | "student";
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}