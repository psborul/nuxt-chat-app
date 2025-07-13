import MembershipRepository from '~/repository/MembershipRepository';

type BodyParams = {
  roomId: string;
  userId: string;
};

export default defineEventHandler(async (event) => {
  const body = await readBody<BodyParams>(event);

  const { userId, roomId } = body;

  const isExist = MembershipRepository.hasUserInRoom(userId, roomId);
  if (isExist) {
    throw new Error("USER ALREADY JOINED")
  }

  MembershipRepository.add(userId, roomId, 'member');
  //TODO: To set roles somehow

  return roomId;
});