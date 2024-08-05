export const joinRooms = (data: any, socket: any) => {
  const rooms = data.map((room: any) => room.name);
  socket?.emit("join", rooms);
};
