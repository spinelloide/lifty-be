export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    username: string;
  };
}
