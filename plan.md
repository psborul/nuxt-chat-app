# ✅ Chat Application Roadmap (Nuxt 3 + WebSocket)

---

## ✅ Authentication

- [ ] Register Page (`/register`)
  - [ ] Input fields: name, email, password
  - [ ] Validate input on client (e.g. email format)
  - [ ] Check if email is already taken (API call)
  - [ ] Store user in DB or temporary in-memory store

- [ ] Login Page (`/login`)
  - [ ] Input fields: email and password
  - [ ] Validate credentials on server
  - [ ] Issue JWT or session on success
  - [ ] Redirect to channels page after login

- [ ] Auth state handling
  - [ ] Store token or user info in Pinia/composables
  - [ ] Auto-redirect to login when not authenticated
  - [ ] Auto-refresh token or validate on reload
  - [ ] Logout method (clear token, redirect)

---

## 💬 Channels

- [ ] Channels Page (`/channels`)
  - [ ] Display list of available public channels
  - [ ] "Create channel" form/button
  - [ ] "Join channel" button for each

- [ ] Create Channel
  - [ ] Input: channel name and type (public/private)
  - [ ] Channel is tied to the creator
  - [ ] Save in DB or memory with metadata

- [ ] Join/Leave Channel
  - [ ] Add user to participants list
  - [ ] Display success or error messages
  - [ ] Leave button to exit channel
  - [ ] Delete own channel if you're the creator

---

## 💻 Chat Page

- [ ] Chat View (`/chat/:channelId`)
  - [ ] Display current channel name and members
  - [ ] Show chat message history
  - [ ] Input box to send messages
  - [ ] Show “typing...” status of other users
  - [ ] Display system messages:
    - [ ] “User joined the channel”
    - [ ] “User left the channel”
    - [ ] “User is typing...”
  - [ ] Leave channel button (visible inside chat)

---

## 📡 WebSocket Integration

- [ ] WebSocket Server
  - [ ] Handle connection and disconnection
  - [ ] Join/leave a channel (room-based logic)
  - [ ] Broadcast messages to specific room
  - [ ] Supported events:
    - [ ] `userJoined`
    - [ ] `userLeft`
    - [ ] `userTyping`
    - [ ] `newMessage`

- [ ] WebSocket Client (Nuxt composable)
  - [ ] `useSocket()` composable
    - [ ] `connect()`
    - [ ] `send(message)`
    - [ ] `onMessage(cb)`
    - [ ] `disconnect()`
  - [ ] Automatically connect after login
  - [ ] Parse and react to incoming events
  - [ ] Manage user and room state locally

---

## 🧠 UX & State Enhancements

- [ ] Show online users in current channel
- [ ] Sidebar: list of active users
- [ ] Differentiate system / user / info messages
- [ ] Auto-scroll to latest message
- [ ] Avatars or name initials in message list
- [ ] Toast/alert on errors or join/leave events

---

## ⚙️ Advanced Features

- [ ] Delete own channel (if owner)
- [ ] Leave any joined channel
- [ ] Join multiple channels at once (optional)
- [ ] Loading indicators during API/WebSocket actions
- [ ] Reconnect logic when WebSocket fails

---

## 📌 Future Ideas (Optional Later)

- [ ] Direct Messages (DMs)
- [ ] Browser Notifications on new message
- [ ] Message pinning
- [ ] Markdown + emoji support in messages
- [ ] File or image attachments
- [ ] Channel roles and permissions
- [ ] Rate-limiting or spam protection

---

## 🔁 WebSocket Event Flow (Schema)

```text
                           CLIENT                               SERVER
───────────────────────────────────────────────────────────────────────────────
User clicks "Join"         ─────▶   WS: { type: "join", channel, username }

                                         ┌──────────────┐
                                         │ Add to room  │
                                         └─────┬────────┘
                                               ↓
                         ◀──── WS to all in room:
                             { type: "join", username, channel }

───────────────────────────────────────────────────────────────────────────────
User sends message         ─────▶ WS: { type: "message", text, username, channel }

                            ◀──── Server broadcasts to channel:
                                  { type: "message", ... }

───────────────────────────────────────────────────────────────────────────────
User types...              ─────▶ WS: { type: "typing", username, channel }

                            ◀──── Server broadcasts:
                                  { type: "typing", username }

───────────────────────────────────────────────────────────────────────────────
User leaves channel        ─────▶ WS: { type: "leave", username, channel }

                            SERVER:
                              - Remove user from room
                              - Broadcast leave event
                            ◀──── WS: { type: "leave", username }
```

## DAY PLAN
Revisit
- Peers page 
  - Create
  - Delete
  - Join

  NetworkServices
  -Create RoomService
  -Create UserService

- Tabs to filter rooms (Favorite, Joined, Available, Own)
- Search
- Create Room Form Modal
- Toggle Theme
- Empty State

📦 Future Paid Features to Pair with Tabs
-Room bookmarks / favorites
-Room activity overview (messages, last seen)
-Advanced search (by owner, keyword, type)
-Pinning important rooms
-User management per room (for owners)