import styles from "./ChartForProductPrediction.module.scss";
import classNames from "classnames/bind";
import PieChartComponent from "./PieChart";
import StackChartComponent from "./StackedChartBar";

const cx = classNames.bind(styles);

function ChartForProductPrediction({ compositeProductPredictedData = [] }) {
  return (
    <div className={cx("wrapper")}>
      <PieChartComponent
        compositeProductPredictedData={compositeProductPredictedData}
      />
      <StackChartComponent
        compositeProductPredictedData={compositeProductPredictedData}
      />
    </div>
  );
}

export default ChartForProductPrediction;
