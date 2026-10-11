export interface User {
  _id: string;
  name: string;
  email: string;
  role: "student" | "faculty" | "admin";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  users: User[];
  page: number;
  limit: number;
  count: number;
}