---
title: Chat App Roadmap
---

# ✅ Chat Application Roadmap (Nuxt 3 + WebSocket)

## ✅ Authentication

- [x] Register Page (`/register`)
  - [x] Input fields: name, email, password
  - [ ] Validate input on client (e.g. email format, password length)
  - [x] Check if email is already taken (API call)
  - [x] Store user in DB or temporary in-memory store
- [x] Login Page (`/login`)
  - [x] Input fields: email and password
  - [x] Validate credentials on server
  - [x] Issue JWT on success
  - [x] Redirect to channels page after login
- [ ] Auth state handling
  - [x] Store token/user in localStorage or composable
  - [ ] Auto-redirect to login if not authenticated
  - [ ] Auto-refresh token / validate on reload
  - [x] Logout (clear token, redirect)
  - [ ] Handle token expiration gracefully

## 🏠 Home / Dashboard

- [x] Landing screen after login
- [ ] Stats (how many rooms, how many people online)
- [ ] Shortcut buttons (My rooms, Favorites, Public, Create)

## 💬 Channels / Rooms

- [x] Channels Page (`/rooms`)
  - [x] List all accessible rooms
  - [x] Show joined, created, or available rooms
  - [x] Room card: name, creator, members, status
  - [x] Join / Leave / Delete actions
- [x] Create Room
  - [x] Modal form with validation
  - [ ] Room description (optional)
  - [ ] Type (public/private/favorite)
  - [ ] Allow password-protected room (future)
  - [ ] Save to database
- [ ] Tabs and Filters
  - [x] Joined
  - [x] Own
  - [ ] Public / Available
  - [ ] Favorites
- [ ] Search
  - [ ] By name
  - [ ] By owner
  - [ ] By participant
- [ ] Pagination or lazy loading (if room list grows)

## 💻 Chat View (`/chat/:roomId`)

- [x] Display current room name, members
- [x] Show message history
- [x] Message input with auto-focus
- [x] MessageItem with user initials, timestamp
- [x] System message styling
- [x] Leave room button
- [x] Show user list in sidebar
- [x] Show count of users and online status
- [ ] Editable message input (arrow up = edit last)
- [ ] Typing indicator
- [ ] Read receipts (who read which message)
- [ ] Pin message(s)
- [ ] Reactions to message (emoji)

## 📡 WebSocket Integration

- [x] WebSocket Server
  - [x] `join` / `leave` / `message` actions
  - [x] Broadcasts per room
- [ ] Events
  - [ ] `userJoined`
  - [ ] `userLeft`
  - [ ] `userTyping`
  - [ ] `userOnline` / `userOffline`
  - [ ] `systemNotice`
- [ ] WebSocket Client
  - [ ] `useSocket()` composable
  - [ ] Connection lifecycle
  - [ ] Reconnect logic
  - [ ] Typed events + handlers
  - [ ] Room state sync
  - [ ] Fallback to polling on fail (maybe)
  - [ ] Connection status badge / UI

## 🧠 UX & UI Enhancements

- [x] Desktop & mobile responsive
- [x] Sidebar with avatars, badges
- [x] Show current room + count + online
- [x] Avatars / initials / online badge
- [x] Chat auto-scroll
- [ ] Keyboard shortcuts (focus input, leave room)
- [ ] Toasts / alerts for:
  - [ ] Join success/fail
  - [ ] New user joined / left
  - [ ] WebSocket disconnect
- [ ] Empty state for no messages or rooms
- [ ] Transitions/animations

## ⚙️ Advanced Features

- [ ] Room bookmarks / favorites
- [ ] Pin messages
- [ ] Room descriptions
- [ ] Invite link sharing
- [ ] Report message/user
- [ ] Kick / mute users (if room owner)
- [ ] Typing indicators
- [ ] Unread message counter per room
- [ ] Blocked users
- [ ] Toggle theme (dark/light)
- [ ] Theme persisted via localStorage
- [ ] User profile edit screen
- [ ] Delete message in Rooms (To validate messages if needed)

## 🔐 Security

- [ ] Secure WebSocket handshake (JWT-based)
- [ ] Token expiration handling
- [ ] Room access control (private rooms, roles)
- [ ] Validate all incoming WS messages server-side
- [ ] Rate limiting / anti-spam
- [ ] XSS sanitization on messages

## 🧩 Modular Services

- [x] `NetworkService` base
- [x] `RoomService` for `/rooms`
- [x] `UserService` for `/users`
- [x] `MessageService` for `/messages`
- [ ] `AuthService` (login, register, validate token)
- [ ] `SocketService` typed wrapper for events

## 🧪 Developer Experience

- [ ] E2E testing (Cypress or Playwright)
- [ ] Unit tests (Jest/Vitest)
- [ ] ESLint + Prettier config
- [ ] GitHub Actions CI
- [ ] Dockerfile + docker-compose
- [ ] Storybook for components

## 📌 Future Premium Features

- [ ] Direct Messages (DMs)
- [ ] Voice/video chat integration
- [ ] Browser notifications
- [ ] Message search
- [ ] Threads / replies
- [ ] User mentions @username
- [ ] Admin dashboard
- [ ] Export chat history
- [ ] File/image uploads
- [ ] Self-hosted deployment script
- [ ] Multi-language (i18n)
- [ ] Billing integration (Stripe, Paddle)

UI IMPROVEMENTS

╔══════════════════════════════════╗
║ 🟢 123                          ••• ║
║ 👤 3 users     📅 Jul 17, 2025    ║
║ 🧑 Owner: You                   ║
║ 🕒 Last active: 5 mins ago      ║
╟──────────────────────────────────╢
║ 🔵 Open Chat   ⚙️ Manage Room     ║
╚══════════════════════════════════╝