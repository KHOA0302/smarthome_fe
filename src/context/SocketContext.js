import {
  createContext,
  useContext,
  useCallback,
  useState,
  useReducer,
  useEffect,
} from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { notificationService } from "../api/notificationService";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

const initNotification = {
  inventoryAlerts: [],
  orderAlerts: [],
};

const socketReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_NOTIFICATION":
      return {
        inventoryAlerts: action.payload.inventoryAlerts,
        orderAlerts: action.payload.orderAlerts,
      };
    case "NEW_INVENTORY_ALERT":
      return {
        ...state,
        inventoryAlerts: [action.payload, ...state.inventoryAlerts],
      };

    case "DELETE_INVENTORY_ALERT":
      console.log("action", action.payload);
      return {
        ...state,
        inventoryAlerts: state.inventoryAlerts.filter(
          (alert) => alert.id !== action.payload.id
        ),
      };

    case "NEW_ORDER_ALERT":
      const newAlert = state.orderAlerts.find(
        (alert) => alert.id === action.payload.id
      );

      if (newAlert) {
        const newOrderAlerts = state.orderAlerts.map((alert) => {
          if (alert.id === newAlert.id) {
            return action.payload;
          }
          return alert;
        });

        return {
          ...state,
          orderAlerts: newOrderAlerts,
        };
      }

      const newOrderAlerts = [action.payload, ...state.orderAlerts];

      return {
        ...state,
        orderAlerts: newOrderAlerts,
      };

    case "DELETE_ORDER_ALERT":
      console.log(action.payload);
      return {
        ...state,
        orderAlerts: state.orderAlerts.filter(
          (alert) => alert.id !== action.payload.id
        ),
      };

    default:
      return state;
  }
};

export function SocketProvider({ children }) {
  const { token } = useAuth();
  const [notificationState, dispatch] = useReducer(
    socketReducer,
    initNotification
  );

  const fetchNotification = useCallback(async () => {
    try {
      const resNotification = await notificationService.getNotificationAlert();
      dispatch({
        type: "FETCH_NOTIFICATION",
        payload: {
          inventoryAlerts: resNotification.data.data?.variantsData || [],
          orderAlerts: resNotification.data.data?.ordersData || [],
        },
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    dispatch({
      type: "FETCH_NOTIFICATION",
      payload: { inventoryAlerts: [], orderAlerts: [] },
    });
    fetchNotification();
  }, [fetchNotification, token]);

  const handleSocketMessage = useCallback((message) => {
    console.log("message: ", message);
    dispatch({ type: message.type, payload: message });
  }, []);

  const { sendMessage, isConnected } = useWebSocket(handleSocketMessage);

  return (
    <SocketContext.Provider
      value={{ notificationState, sendMessage, isConnected }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
