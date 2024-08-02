import { io } from "socket.io-client";

const token = localStorage.getItem("CT_access_token");

export const socket = io("http://localhost:8000/group", {
  auth: { token: `Bearer ${token}` },
});
