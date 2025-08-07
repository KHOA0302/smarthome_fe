import styles from "./DiscountEventAnnouncement.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);
function DiscountEventAnnouncement() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("event")}>
          <div className={cx("title")}>
            <div>
              <h1>Ưu đãi khủng chỉ diễn ra trong dịp này</h1>
              <h1>Dành riêng cho bạn</h1>
            </div>
            <button>Tìm hiểu thêm</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiscountEventAnnouncement;
