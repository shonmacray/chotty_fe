"use client";
import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

let socket: ReturnType<typeof io> | null = null;

export const useSocket = () => {
  useEffect(() => {
    const token = localStorage.getItem("CT_access_token");
    if (!socket) {
      socket = io(`${process.env.NEXT_PUBLIC_API_URL}/group`, {
        auth: { token: `Bearer ${token}` },
      });
    }
    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return socket;
};
