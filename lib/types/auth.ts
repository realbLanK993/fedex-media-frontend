export interface Session {
  id: string;
  secretHash: string; // Uint8Array is a byte array
  createdAt: Date;
}

export interface SessionWithToken extends Session {
  token: string;
}
