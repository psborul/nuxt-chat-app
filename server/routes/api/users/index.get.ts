import MembershipRepository from "~/server/repository/MembershipRepository";
import UserRepository from "~/server/repository/UserRepository";

type QueryParams = {
  roomId?: string;
};

export default defineEventHandler((event) => {
  const query = getQuery<QueryParams>(event);

  if (query.roomId) {
    const userIds = MembershipRepository.getRoomUsers(query.roomId as string);

    return userIds.map((userId) => UserRepository.findById(userId));
  }

  return UserRepository.findAll();
  // TODO: REWORK IF THIS ROUTE WILL EXIST
});
