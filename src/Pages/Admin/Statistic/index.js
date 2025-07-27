import RevenueStatistic from "../../../Component/RevenueStatistic";
import styles from "./Statistic.module.scss";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import orderService from "../../../api/orderService";
import { formatNumber } from "../../../utils/formatNumber";

const cx = classNames.bind(styles);
const lookup = {
  decrease: "Giảm",
  increase: "Tăng",
};

function Statistic() {
  const [revenue, setRevenue] = useState([]);
  const [currentQuarter, setCurrentQuarter] = useState({});

  useEffect(() => {
    const fetchQuarterlyRevenue = async () => {
      try {
        const res = await orderService.getOrderQuarterlyRevenue();
        setRevenue(res.data);
        setCurrentQuarter(
          res.data[res.data.length - 1].quarters[
            res.data[res.data.length - 1].quarters.length - 1
          ]
        );
      } catch (error) {}
    };
    fetchQuarterlyRevenue();
  }, []);

  const price = 0;

  return (
    <div className={cx("wrapper")}>
      <div className={cx("blank")}>
        <div>Chọn quý</div>
        <div className={cx("container")}>
          <div className={cx("statistic-top")}>
            <div
              className={cx("revenue", {
                [currentQuarter.compareToPre]: true,
              })}
            >
              <span>Tổng doanh thu quý</span>
              <span>{formatNumber(price)}đ</span>
              <span>
                {lookup[currentQuarter.compareToPre] + " "}
                {currentQuarter.compareToPreValue + "%"} so với quý trước
              </span>
            </div>
            <div className={cx("product")}>
              <span>Tổng sản phẩm bán ra quý</span>
              <span></span>
              <span></span>
            </div>
            <div></div>
          </div>
          <div className={cx("statistic-main")}>
            <RevenueStatistic revenue={revenue} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistic;
