import styles from "./OutStockAlert.module.scss";
import classNames from "classnames/bind";
import { useState, useCallback, useEffect } from "react";
import { useWebSocket } from "../../hooks/useWebSocket";

const cx = classNames.bind(styles);

function OutStockAlert() {
  const [alerts, setAlerts] = useState([]);

  const handleSocketMessage = useCallback((message) => {
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

  return <div className={cx("wrapper")}></div>;
}

export default OutStockAlert;
