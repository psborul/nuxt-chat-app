// socket-server.js
import { createServer } from 'http'
import { Server } from 'socket.io'

const PORT = 8080

const httpServer = createServer()

const io = new Server(httpServer, {
  cors: {
    origin: '*', // allow all origins for dev, adjust in prod
  }
})

io.on('connection', (socket) => {
  console.log('📡 Client connected:', socket.id)

  socket.on('chat message', (msg) => {
    console.log('💬 Message received:', msg)
    io.emit('chat message', msg)
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

httpServer.listen(PORT, () => {
  console.log(`✅ Socket.IO server running at http://localhost:${PORT}`)
})
