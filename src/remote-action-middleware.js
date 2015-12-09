export default socket => store => next => action => {
  if (action.meta && action.meta.remote) {
    console.log(action)
    socket.emit(action.type, action.payload)
  }
  return next(action)
}

