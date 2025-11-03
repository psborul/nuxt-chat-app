export type User = {
  token: string;
  id: string;
  username: string;
  email: string;
  plan: "free" | "paid"
}