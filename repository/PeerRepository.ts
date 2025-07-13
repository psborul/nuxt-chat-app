import type { Peer } from "./index";

export class PeersRepository {
  private peers = new Map<string, Peer>(); // key = socketId

  add(peer: { id: string; send: (msg: string) => void }) {
    const payload: Peer = {
      peerId: peer.id,
      send: peer.send,
      userId: undefined,
      roomId: undefined,
    };
    this.peers.set(peer.id, payload);
  }

  remove(socketId: string) {
    this.peers.delete(socketId);
  }

  get(socketId: string): Peer | undefined {
    return this.peers.get(socketId);
  }

  getByUserId(userId: string): Peer[] {
    return Array.from(this.peers.values()).filter((p) => p.userId === userId);
  }

  getByRoom(roomId: string): Peer[] {
    return Array.from(this.peers.values()).filter((p) => p.roomId === roomId);
  }

  getAll(): Peer[] {
    return Array.from(this.peers.values());
  }

  setUser(socketId: string, userId: string) {
    const peer = this.peers.get(socketId);
    if (peer) peer.userId = userId;
  }

  setRoom(socketId: string, roomId: string) {
    const peer = this.peers.get(socketId);
    if (peer) peer.roomId = roomId;
  }
}

export default new PeersRepository();
