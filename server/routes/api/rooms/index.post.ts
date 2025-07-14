import type { Role } from "~/server/repository";
import MembershipRepository from "~/server/repository/MembershipRepository";
import RoomRepository from "~/server/repository/RoomRepository";

// CREATE ROOM

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { id: userId } = getUserFromToken(event);
  //TODO: to add middleware to parse body

  const { name } = body;

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
