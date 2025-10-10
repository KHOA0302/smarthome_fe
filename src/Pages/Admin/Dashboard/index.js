import pixelGif from "../../../images/4d670e6307fb44c4d4b6d8d14a5661fa.gif";
import styles from "./Dashboard.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);
function Dashboard() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <img src={pixelGif} />
      </div>
    </div>
  );
}

export default Dashboard;
