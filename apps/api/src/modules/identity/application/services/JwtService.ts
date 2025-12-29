export interface JwtPayload {
  userId: string;
  email: string;
  accountId: string;
  role: string;
  iat?: number;
  exp?: number;
  [key: string]: any;
}

export interface JwtService {
  sign(payload: Omit<JwtPayload, "iat" | "exp">): Promise<string>;
  verify(token: string): Promise<JwtPayload>;
}
