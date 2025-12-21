import { createContext, useContext, useReducer, useCallback } from "react";
import { useWebSocket } from "../hooks/useWebSocket";

const SocketContext = createContext();

const initialState = {
  inventoryAlerts: [],
};

function socketReducer(state, action) {
  switch (action.type) {
    case "ADD_INVENTORY_ALERT":
      return {
        ...state,
        inventoryAlerts: [action.payload, ...state.inventoryAlerts],
      };
    case "REMOVE_INVENTORY_ALERT":
      return {
        ...state,
        inventoryAlerts: state.inventoryAlerts.filter(
          (a) => a.id !== action.payload.id
        ),
      };
    default:
      return state;
  }
}

export function SocketProvider({ children }) {
  const [state, dispatch] = useReducer(socketReducer, initialState);

  const handleSocketMessage = useCallback((message) => {
    if (message.type === "NEW_INVENTORY_ALERT") {
      dispatch({ type: "ADD_INVENTORY_ALERT", payload: message });
    }
  }, []);

  const { sendMessage, isConnected } = useWebSocket(handleSocketMessage);

  return (
    <SocketContext.Provider value={{ state, sendMessage, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
