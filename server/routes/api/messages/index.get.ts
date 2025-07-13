import MessageRepository from '~/repository/MessageRepository';

type QueryParams = {
  roomId?: string;
};

export default defineEventHandler((event) => {
  const query = getQuery<QueryParams>(event);

  if (query.roomId) {
    const messages = MessageRepository.getRoomMessages(query.roomId);
    return messages;
  }

  throw new Error("THERE IS NO SUCH ROOM")
});
