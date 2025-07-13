import MembershipRepository from '~/repository/MembershipRepository';
import RoomRepository from '~/repository/RoomRepository';

type BodyParams = {
  roomId: string;
  userId: string;
};

export default defineEventHandler(async (event) => {
  const body = await readBody<BodyParams>(event);

  const { userId, roomId } = body;

  const isOwner = MembershipRepository.isOwner(roomId, userId);

  if (!isOwner) {
    throw new Error("ONLY OWNER COULD DELETE THE ROOM");
  }

  RoomRepository.deleteRoom(roomId);
  MembershipRepository.deleteRoom(roomId)

  return roomId;
});