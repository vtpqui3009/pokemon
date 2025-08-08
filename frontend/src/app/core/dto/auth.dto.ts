export interface AuthPayload {
  username: string;
  password: string;
}

export interface AuthResponse {
  id: number;
  username: string;
  token?: string;
  createdAt: string;
  updatedAt: string;
}
