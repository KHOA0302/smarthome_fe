import styles from "./OutStockAlert.module.scss";
import classNames from "classnames/bind";
import { useState, useCallback, useEffect } from "react";
import { useWebSocket } from "../../hooks/useWebSocket";

const cx = classNames.bind(styles);

function OutStockAlert() {
  const [alerts, setAlerts] = useState([]);

  const handleSocketMessage = useCallback((message) => {
    console.log("Tin nhắn Socket nhận được:", message);

    switch (message.type) {
      case "NEW_INVENTORY_ALERT":
        setAlerts((prev) => [message, ...prev]);
        break;

      case "INVENTORY_ALERT_RESOLVED":
        setAlerts((prev) =>
          prev.filter((alert) => alert.variant_id !== message.variant_id)
        );
        break;

      case "INVENTORY_ALERT_DELETED":
        setAlerts((prev) =>
          prev.filter((alert) => alert.alert_id !== message.alert_id)
        );
        break;

      default:
        console.warn("Type Socket không xác định:", message.type);
    }
  }, []);

  const { isConnected } = useWebSocket(handleSocketMessage);

  useEffect(() => {
    // Gọi API để fetch danh sách alerts ban đầu
    // fetchAlertsAPI().then(data => setAlerts(data));
  }, []);

  return (
    <div className={cx("admin-alerts-container")}>
      <h3>
        Trạng thái Socket: {isConnected ? "🟢 Đã kết nối" : "🔴 Mất kết nối"}
      </h3>
      {/* Hiển thị danh sách alerts */}
    </div>
  );
}

export default OutStockAlert;
