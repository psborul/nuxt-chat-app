import type { Role } from "~/repository";
import MembershipRepository from "~/repository/MembershipRepository";
import RoomRepository from "~/repository/RoomRepository";

// CREATE ROOM

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  //TODO: to add middleware to parse body

  const { userId, name } = body;

  const isPrivate = false;
  // TODO: use JWT instead of payload

  const roomId = RoomRepository.createRoom({
    name,
    createdBy: userId,
    isPrivate,
  });

  const role: Role = "owner";

  MembershipRepository.add(userId, roomId, role);

  return roomId;
});
