export type Room = {
  id: string;
  userIds: Set<string>;
  name: string;
  ownerId: string;
  peers?: any;
};

export type User = {
  email: string;
  id: string;
  token: string;
  username: string;
}