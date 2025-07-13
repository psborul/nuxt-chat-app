import MembershipRepository from "~/repository/MembershipRepository";
import RoomRepository from "~/repository/RoomRepository";

type QueryParams = {
  roomId?: string;
  userId?: string;
};

export default defineEventHandler((event) => {
  const query = getQuery<QueryParams>(event);

  if (query.roomId) {
    const room = RoomRepository.getRoom(query.roomId);
    return {
      ...room,
      users: MembershipRepository.getRoomUsers(query.roomId),
    };
  }

  if (query.userId) {
    const rooms = RoomRepository.getAll().map((room) => {
      return {
        ...room,
        users: MembershipRepository.getRoomUsers(room.id),
        joined: MembershipRepository.hasUserInRoom(query.userId!, room.id),
        isOwner: MembershipRepository.isOwner(room.id, query.userId!)
      };
    });

    return rooms;
  }

  const rooms = RoomRepository.getAll().map((room) => {
    return {
      ...room,
      users: MembershipRepository.getRoomUsers(room.id),
    };
  });

  return rooms;
});
