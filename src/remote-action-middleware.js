export default socket => store => next => action => {
  if (action.meta && action.meta.remote) {
    console.log(action)
    console.log(socket)
    console.log(action.type, action.payload)
    socket.emit('hello', action.payload)
    socket.emit(action.type, action.payload)
  }
  return next(action)
}

