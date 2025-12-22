import { createContext, useContext, useCallback, useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [lastMessage, setLastMessage] = useState({ type: null });
  const handleSocketMessage = useCallback((message) => {
    setLastMessage(message);
  }, []);

  const { sendMessage, isConnected } = useWebSocket(handleSocketMessage);

  return (
    <SocketContext.Provider value={{ lastMessage, sendMessage, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
