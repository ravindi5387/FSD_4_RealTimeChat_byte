export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

export interface AuthenticatedRequest extends Express.Request {
  user?: AuthUser;
}
