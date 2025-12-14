import { useEffect, useCallback, useRef } from "react";

const WS_URL = "http://localhost:8080";

export function useWebSocket(handleSocketMessage) {
  const socketRef = useRef(null);

  const connect = useCallback(() => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      return;
    }

    const ws = new WebSocket(WS_URL);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket Connected!");
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        handleSocketMessage(message);
      } catch (e) {
        console.error("Lỗi parse JSON từ Socket:", e);
      }
    };

    ws.onclose = () => {
      console.log("❌ WebSocket Disconnected. Trying to reconnect in 3s...");
      setTimeout(connect, 3000);
    };

    ws.onerror = (error) => {
      console.error("Socket Error:", error);

      ws.close();
    };
  }, [handleSocketMessage]);

  useEffect(() => {
    connect();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [connect]);

  const sendMessage = (data) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data));
    } else {
      console.warn("Socket not open. Message not sent.");
    }
  };

  return {
    sendMessage,
    isConnected: socketRef.current?.readyState === WebSocket.OPEN,
  };
}
