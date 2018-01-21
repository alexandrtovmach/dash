const io = require('socket.io')
let server

module.exports = {

  initialize: (connection) => {
    server = io.listen(connection)
    server.on('connection', (socket) => {

      socket.on('room', (roomId) => {
        socket.room = roomId
        socket.join(roomId)
      })
  
      socket.on('leaveroom', () => {
        if (socket.room) {
          socket.leave(socket.room)
        }
      })
    })
  },

  newMessage: (roomId, message) => {
    server.to(roomId).emit('newmessage', message)
  }

}
