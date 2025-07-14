import type { Role } from "./index";
import { Membership } from "./index";

export class MembershipRepository {
  private memberships: Membership[] = [];

  remove(userId: string, roomId: string) {
    const exists = this.memberships.some(
      (m) => m.userId === userId && m.roomId === roomId
    );
    //TODO: to add error hadnling
    if (!exists) {
      throw new Error("USER IS NOT IN ROOM")
    }
    console.log(this.memberships)

    this.memberships = this.memberships.filter(membership => !(membership.roomId === roomId && membership.userId === userId))

  }

  add(userId: string, roomId: string, role: Role = "member") {
    const exists = this.memberships.some(
      (m) => m.userId === userId && m.roomId === roomId
    );
    const joinedAt = new Date();
    //TODO: to add error handling
    if (!exists) {
      this.memberships.push(
        new Membership({
          userId,
          roomId,
          role,
          joinedAt,
        })
      );
    }

    console.log(this.memberships)
  }

  deleteRoom(roomId: string): string[] {
    const affectedUsers = this.getRoomUsers(roomId);
    this.memberships = this.memberships.filter((m) => m.roomId !== roomId);
    //TODO: MAYBE TO REUSE THIS
    return affectedUsers;
  }

  getUserRooms(userId: string): string[] {
    return this.memberships
      .filter((m) => m.userId === userId)
      .map((m) => m.roomId);
  }

  isOwner(roomId: string, userId: string): boolean {
    console.log(this.memberships)
    return this.memberships.some(
      (m) => m.roomId === roomId && m.userId === userId && m.role === "owner"
    );
  }

  getRoomUsers(roomId: string): string[] {
    return this.memberships
      .filter((m) => m.roomId === roomId)
      .map((m) => m.userId);
  }

  hasUserInRoom(userId: string, roomId: string): boolean {
    return this.memberships.some(
      (m) => m.userId === userId && m.roomId === roomId
    );
  }
}

export default new MembershipRepository();
