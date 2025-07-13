export type Room = {
  id: string;
  userIds: Set<string>;
  name: string;
  ownerId: string;
  peers?: any;
};