# nuxt-chat-app

Realtime multi-user chat built on Nuxt 4. Originally written on Nuxt 2 in 2020 and migrated end-to-end in 2026.

## Tech stack

| Layer | Tech |
| --- | --- |
| Framework | [Nuxt 4](https://nuxt.com/) (Vue 3, Nitro) |
| UI | [Vuetify 4](https://vuetifyjs.com/) via [`vuetify-nuxt-module`](https://github.com/vuetifyjs/nuxt-module), Material Design Icons |
| State | [Pinia 3](https://pinia.vuejs.org/) (`@pinia/nuxt`) |
| Realtime | [socket.io 4](https://socket.io/) — Nitro server plugin + Nuxt client plugin |
| Language | TypeScript 6 |

## Requirements

- Node **18+** (a `.nvmrc` pins to Node 22 for development)

## Getting started

```bash
nvm use            # picks up .nvmrc
npm install
npm run dev        # http://localhost:3000
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build |
| `npm run preview` | Run the production build locally |
| `npm run generate` | Static-site generation |

## How it's wired

- **`server/plugins/socket.ts`** — attaches a socket.io 4 server to Nitro's HTTP server on the first request. Owns the room state via `server/utils/users.ts` and broadcasts messages built from `server/utils/Message.ts`.
- **`plugins/socket.client.ts`** — opens a `socket.io-client` connection, provides it as `$socket`, and forwards `newMessage` / `updateUsers` / reconnect events into the Pinia store.
- **`stores/chat.ts`** — single Pinia store: `user`, `messages`, `users`, plus `createUser` (uses `emitWithAck` for the join handshake), `joinRoom`, `createMessage`, `setTypingStatus`, `leftRoom`, `reconnect`.
- **`middleware/auth.ts`** — guards `/chat`; redirects to `/?message=noUser` when the store has no user.
- **`pages/index.vue`** — login form, snackbar for query-string messages, redirects to `/chat` on submit.
- **`pages/chat.vue`** — message list, typing indicator, autoscroll on new messages.

## Manual test

1. Open `http://localhost:3000` in two browser windows.
2. Log into the same room from both as different names.
3. You should see each other in the user list, typing indicators, messages, and a "User X left chat" line when one window exits.

## Deploy (Render)

The app needs a Node runtime + WebSocket support, so static hosts (GitHub Pages, Netlify, classic Vercel static) don't work. `render.yaml` is a [Render Blueprint](https://render.com/docs/blueprint-spec) using Render's free Node runtime.

One-time setup:

1. Push this repo to GitHub.
2. Open https://dashboard.render.com/blueprints → "New Blueprint Instance" → pick the repo.
3. Render reads `render.yaml`, builds (`npm ci && npm run build`), and starts (`node .output/server/index.mjs`).

Subsequent pushes to `master` auto-redeploy.

Notes:
- Free tier sleeps after ~15 min idle (cold start ~30s on wake).
- Chat state is in-memory, so the service runs as **one** instance. Horizontal scaling requires a socket.io Redis adapter + shared store.
- Optional: lock down socket.io CORS to your Render URL by uncommenting `SOCKET_IO_CORS_ORIGIN` in `render.yaml`.

## Demo

Live on Render: https://nuxt-chat-app-5.onrender.com

(First request after ~15 min of inactivity takes ~30s while the free instance wakes up.)

Originally deployed at https://nuxt-chat-app.herokuapp.com/ — kept here for history; Heroku's free tier was retired in 2022 so the URL is no longer live.

## Original tutorials

The Nuxt 2 version of this project was built following:

- https://medium.com/@stfalconcom/chat-app-creation-using-vue-js-nuxt-js-node-js-socket-io-vue-socket-io-vuetify-js-technologies-5f15f0781476
- https://psborul.medium.com/update-for-chat-app-creation-using-vue-js-nuxt-js-node-js-socket-io-vuetify-js-technologies-9b735754865

Those are kept for historical reference; the current implementation diverges significantly (Nitro instead of a standalone Express server, Pinia instead of Vuex, Vue 3 composition API throughout).
