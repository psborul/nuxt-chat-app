import MembershipRepository from '~/server/repository/MembershipRepository';
import RoomRepository from '~/server/repository/RoomRepository';

type BodyParams = {
  roomId: string;
  userId: string;
};

export default defineEventHandler(async (event) => {
  const body = await readBody<BodyParams>(event);
  const { id: userId } = getUserFromToken(event);

  const { roomId } = body;

  const isOwner = MembershipRepository.isOwner(roomId, userId);

  if (!isOwner) {
    throw new Error("ONLY OWNER COULD DELETE THE ROOM");
  }

  RoomRepository.deleteRoom(roomId);
  MembershipRepository.deleteRoom(roomId)

  return roomId;
});