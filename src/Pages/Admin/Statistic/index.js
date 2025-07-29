import RevenueStatistic from "../../../Component/RevenueStatistic";
import styles from "./Statistic.module.scss";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import orderService from "../../../api/orderService";
import { formatNumber } from "../../../utils/formatNumber";
import { ArrowRightIcon, QuarterIcon } from "../../../icons";
import ProductStatistic from "../../../Component/ProductStatistic";

const cx = classNames.bind(styles);
const lookup = {
  decrease: "Giảm",
  increase: "Tăng",
  stable: "Ổn định",
  null: "Không có dữ liệu so sánh",
};

function YearsChosen({ revenues, setCurrentQuarter, currentQuarter }) {
  const [showYears, setShowYears] = useState(false);
  const [showYear, setShowYear] = useState("");

  const handleYear = (revenue) => {
    if (showYear === "" || revenue.year !== showYear) {
      setShowYear(revenue.year);
    } else {
      setShowYear("");
    }
  };

  return (
    <div className={cx("years")}>
      <button onClick={() => setShowYears(!showYears)}>
        <QuarterIcon />
        <span>
          {currentQuarter.name?.toUpperCase()}-{currentQuarter.year}
        </span>
      </button>
      <div className={cx("years-container", { show: showYears })}>
        {revenues.map((revenue, id) => {
          return (
            <div className={cx("year")} key={id}>
              <span onClick={() => handleYear(revenue)}>{revenue.year}</span>
              <div
                className={cx("year-container", {
                  show: showYear === revenue.year,
                })}
              >
                {revenue.quarters.map((quarter, i) => {
                  return (
                    <ul className={cx("quarters")} key={i}>
                      <li
                        onClick={() => {
                          setCurrentQuarter({ ...quarter, year: revenue.year });
                        }}
                      >
                        <ArrowRightIcon />
                        <span>{quarter.name}</span>
                      </li>
                    </ul>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Statistic() {
  const [revenues, setRevenues] = useState([]);
  const [currentQuarter, setCurrentQuarter] = useState({});

  useEffect(() => {
    const fetchQuarterlyRevenue = async () => {
      try {
        const res = await orderService.getOrderQuarterlyRevenue();

        setRevenues(res.data);
        setCurrentQuarter({
          ...res.data[res.data.length - 1].quarters[
            res.data[res.data.length - 1].quarters.length - 1
          ],
          year: res.data[res.data.length - 1].year,
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchQuarterlyRevenue();
  }, []);

  const totalQuarterProduct = currentQuarter?.products?.reduce(
    (a, product) => a + product.sold_quantity,
    0
  );

  return (
    <div className={cx("wrapper")}>
      <div className={cx("blank")}>
        <YearsChosen
          revenues={revenues}
          setCurrentQuarter={setCurrentQuarter}
          currentQuarter={currentQuarter}
        />
        <div className={cx("container")}>
          <div className={cx("statistic-top")}>
            <div
              className={cx("revenue", {
                [currentQuarter.diffPercentRevenueStatus]: true,
              })}
            >
              <span>Tổng doanh thu quý</span>
              <span>{formatNumber(currentQuarter.revenue)}đ</span>
              <span>
                {lookup[currentQuarter.diffPercentRevenueStatus] + " "}
                {!!currentQuarter.diffPercentRevenueStatus &&
                  (currentQuarter.diffPercentRevenue > 0
                    ? currentQuarter.diffPercentRevenue +
                      "%" +
                      " so với quý trước"
                    : " so với quý trước")}
              </span>
            </div>
            <div
              className={cx("product", {
                [currentQuarter.diffPercentProductStatus]: true,
              })}
            >
              <span>Tổng sản phẩm bán ra quý</span>
              <span>{formatNumber(totalQuarterProduct)} sản phẩm</span>
              <span>
                {lookup[currentQuarter.diffPercentProductStatus] + " "}
                {!!currentQuarter.diffPercentProductStatus &&
                  (currentQuarter.diffPercentProduct > 0
                    ? currentQuarter.diffPercentProduct +
                      "%" +
                      " so với quý trước"
                    : " so với quý trước")}
              </span>
            </div>
          </div>
          <div className={cx("statistic-main")}>
            <RevenueStatistic
              revenues={revenues}
              currentQuarter={currentQuarter}
            />

            <ProductStatistic
              products={currentQuarter.products}
              quarterName={currentQuarter.name}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistic;
