// src/hooks/useWebSocket.js
import { useEffect, useCallback, useRef } from "react";

// Đảm bảo URL này khớp với nơi Server Node.js của bạn đang host WebSocket
const WS_URL = "http://localhost:8080"; // Thay bằng URL production thực tế của bạn

export function useWebSocket(handleSocketMessage) {
  // Sử dụng ref hoặc biến ngoài để giữ kết nối, tránh tái tạo liên tục
  const socketRef = useRef(null);

  // Hàm kết nối chính
  const connect = useCallback(() => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      return; // Đã kết nối
    }

    const ws = new WebSocket(WS_URL);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket Connected!");
    };

    // BƯỚC 2: LẮNG NGHE & PHÂN TÍCH TIN NHẮN
    ws.onmessage = (event) => {
      try {
        // Tin nhắn từ BE là chuỗi JSON, phải parse thành Object
        const message = JSON.parse(event.data);

        // Chuyển Object tin nhắn đã parse cho hàm xử lý logic (được truyền từ Component)
        handleSocketMessage(message);
      } catch (e) {
        console.error("Lỗi parse JSON từ Socket:", e);
      }
    };

    ws.onclose = () => {
      console.log("❌ WebSocket Disconnected. Trying to reconnect in 3s...");
      // Cơ chế tự động kết nối lại (Retry)
      setTimeout(connect, 3000);
    };

    ws.onerror = (error) => {
      console.error("Socket Error:", error);
      // Đóng kết nối để kích hoạt onclose và retry
      ws.close();
    };
  }, [handleSocketMessage]); // Phụ thuộc vào hàm xử lý tin nhắn

  useEffect(() => {
    connect();

    // Cleanup: Đóng kết nối khi Component bị unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [connect]);

  // Trả về hàm gửi tin nhắn (nếu cần) và trạng thái
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
