export type Role = "owner" | "admin" | "member";

export type UserData = {
  id: string;
  username: string;
  online: boolean;
  typingStatus?: boolean;
  email: string;
  passwordHash: string;
  passwordSalt: string;
};

export type RoomData = {
  id: string;
  name: string;
  isPrivate: boolean;
  createdBy: string;
  createdAt: Date;
};

export type MessageData = {
  id: string;
  roomId: string;
  userId: string;
  content: string;
  createdAt: Date;
};

export type MembershipData = {
  userId: string;
  roomId: string;
  role: Role;
  joinedAt: Date;
};

export type PeerData = {
  userId: string;
  peerId: string;
  roomId?: string;
};

export class User {
  public id: string;
  public username: string;
  public online: boolean;
  public typingStatus?: boolean;
  public email: string;
  public passwordHash: string;
  public passwordSalt: string;

  constructor({
    id,
    username,
    online,
    email,
    passwordHash,
    passwordSalt,
    typingStatus,
  }: UserData) {
    this.id = id;
    this.username = username;
    this.online = online;
    this.email = email;
    this.passwordHash = passwordHash;
    this.passwordSalt = passwordSalt;
    this.typingStatus = typingStatus;
  }
}

export class Room {
  public id: string;
  public name: string;
  public isPrivate: boolean = false;
  public createdBy: string;
  public createdAt: Date;

  constructor({ id, name, isPrivate, createdBy, createdAt }: RoomData) {
    this.id = id;
    this.name = name;
    this.isPrivate = isPrivate;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
  }
}

export class Message {
  public id: string;
  public roomId: string;
  public userId: string;
  public content: string;
  public createdAt: Date;

  constructor({ id, roomId, userId, content, createdAt }: MessageData) {
    this.id = id;
    this.roomId = roomId;
    this.userId = userId;
    this.content = content;
    this.createdAt = createdAt;
  }
}

export class Membership {
  public userId: string;
  public roomId: string;
  public role: Role = "member";
  public joinedAt: Date;

  constructor({ userId, roomId, role, joinedAt }: MembershipData) {
    this.userId = userId;
    this.roomId = roomId;
    this.role = role;
    this.joinedAt = joinedAt;
  }
}

export class Peer {
  public userId?: string;
  public peerId: string;
  public roomId?: string;

  constructor({ userId, roomId, peerId }: PeerData) {
    this.userId = userId;
    this.roomId = roomId;
    this.peerId = peerId;
  }

  send(msg: string) {
    console.log(msg);
  }
}
