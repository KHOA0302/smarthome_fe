import { useState } from "react";
import styles from "./ToggleBtn.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function ToggleBtn({ active }) {
  const [status, setStatus] = useState(active);

  const handleToggle = () => {
    setStatus(!status);
  };

  return (
    <button className={cx("wrapper")} onClick={handleToggle}>
      <div className={cx("container", { reverse: !status })}>
        <span>{status ? "🟢" : "🔴"}</span>
        <span>{status ? "on" : "off"}</span>
      </div>
    </button>
  );
}

export default ToggleBtn;
