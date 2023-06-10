export type Payload = {
  email: string;
  sub: number;
  iat: number; //tokenが作成された時刻
  exp: number; // tokenの有効期限
};
