export const joinRooms = (data: any, socket: any) => {
  const rooms = data.map((room: any) => room.name);
  socket?.emit("join", rooms);
};

export const userColors: { [key: string]: string } = {
  blue: "#1d4ed8",
  green: "#15803d",
  orange: "#c2410c",
  yellow: "#a16207",
  lime: "#4d7c0f",
  teal: "#0f766e",
  cyan: "#0e7490",
  violet: "#6d28d9",
  pink: "#be185d",
  rose: "#be123c",
};
