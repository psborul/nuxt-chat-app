// Constants shared by client and server. Single source of truth so a typo
// or length change on one side can't silently diverge from the other.

export const MAX_NAME_LEN = 16
export const MAX_ROOM_LEN = 16
export const MAX_MSG_LEN = 1000

// UI tuning
export const SNACKBAR_TIMEOUT_MS = 3000
export const CREATE_USER_TIMEOUT_MS = 10_000
export const CHAT_AUTOSCROLL_THRESHOLD_PX = 80

// Socket.io event names. Use these everywhere instead of bare strings.
export const SOCKET_EVENTS = {
  CREATE_USER: 'createUser',
  JOIN_ROOM: 'joinRoom',
  CREATE_MESSAGE: 'createMessage',
  SET_TYPING_STATUS: 'setTypingStatus',
  LEFT_CHAT: 'leftChat',
  NEW_MESSAGE: 'newMessage',
  UPDATE_USERS: 'updateUsers',
} as const

// The author of admin/system messages ("User X joined", etc.).
export const SYSTEM_AUTHOR = 'admin'
