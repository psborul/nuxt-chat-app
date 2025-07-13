import type { BroadcastMessage, Peer } from '~/types'

type RoomEntry = {
  peer: Peer
  userId: string
}

type JoinRoomArgs = {
  peer: Peer
  roomId: string
  userId: string
}

const rooms = new Map<string, Set<RoomEntry>>()

/**
 * Adds a peer to a room.
 */
export function joinRoom({ peer, roomId, userId }: JoinRoomArgs) {
  let room = rooms.get(roomId)
  if (!room) {
    room = new Set()
    rooms.set(roomId, room)
  }

  room.add({ peer, userId })
}

/**
 * Removes a peer from the room by userId.
 */
export function leaveRoom({ userId, roomId }: { userId: string; roomId: string }) {
  const room = rooms.get(roomId)
  if (!room) {
    throw new Error(`Room "${roomId}" doesn't exist`)
  }

  for (const entry of room) {
    if (entry.userId === userId) {
      room.delete(entry)
      console.log(`User ${userId} left room ${roomId}`)
      return
    }
  }

  console.warn(`User ${userId} not found in room ${roomId}`)
}

/**
 * Broadcasts a message to all peers in a room, excluding a specific userId if provided.
 */
export function broadcastToRoom({ roomId, content, excludeUserId }: BroadcastMessage) {
  const room = rooms.get(roomId)
  if (!room) return

  for (const { peer, userId } of room) {
    if (userId === excludeUserId) continue

    try {
      peer.send(content)
    } catch (err) {
      console.error(`Failed to send message to user ${userId}:`, err)
    }
  }
}
