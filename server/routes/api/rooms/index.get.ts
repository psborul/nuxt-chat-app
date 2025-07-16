import MembershipRepository from "~/server/repository/MembershipRepository";
import RoomRepository from "~/server/repository/RoomRepository";
import { getUserFromToken } from "~/server/utils/auth";

type QueryParams = {
  roomId?: string;
};

export default defineEventHandler((event) => {
  const { id: userId } = getUserFromToken(event);
  const query = getQuery<QueryParams>(event);

  if (query.roomId) {
    const room = RoomRepository.getRoom(query.roomId);
    return {
      ...room,
      users: MembershipRepository.getRoomUsers(query.roomId),
    };
  }

  const rooms = RoomRepository.getAll().map((room) => {
    return {
      ...room,
      users: MembershipRepository.getRoomUsers(room.id),
      joined: MembershipRepository.hasUserInRoom(userId, room.id),
      isOwner: MembershipRepository.isOwner(room.id, userId),
    };
  });

  return rooms;
});
