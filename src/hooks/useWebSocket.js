// hooks/useWebSocket.js
import { useEffect, useCallback, useRef, useState } from "react";

const WS_URL = "http://localhost:8080";

export function useWebSocket(onMessageCallback) {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(WS_URL);
    socketRef.current = ws;

    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => {
      setIsConnected(false);
      setTimeout(connect, 3000); // Tự động kết nối lại sau 3 giây
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

  return { sendMessage, isConnected };
}
