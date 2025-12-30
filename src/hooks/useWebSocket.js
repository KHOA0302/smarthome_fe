// hooks/useWebSocket.js
import { useEffect, useCallback, useRef, useState } from "react";

const WS_URL = "ws://localhost:8080";

export function useWebSocket(onMessageCallback) {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) return;

    const token = localStorage.getItem("jwt_token");
    const sessionId = localStorage.getItem("guest_session_id");

    const params = new URLSearchParams();
    if (token) params.append("token", token);
    if (sessionId) params.append("sessionId", sessionId);

    const finalUrl = `${WS_URL}?${params.toString()}`;

    const ws = new WebSocket(finalUrl);
    socketRef.current = ws;

    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => {
      setIsConnected(false);
      setTimeout(connect, 3000);
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessageCallback(data);
    };

    return ws;
  }, [onMessageCallback]);

  useEffect(() => {
    connect();
    return () => socketRef.current?.close();
  }, [connect]);

  const sendMessage = (data) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data));
    }
  };

  const closeSocket = () => {
    if (socketRef.current) {
      socketRef.current.close();
      setIsConnected(false);
      console.log("Đang chuyển đổi sang chế độ khách...");
      connect();
    }
  };

  return { sendMessage, closeSocket, isConnected };
}
