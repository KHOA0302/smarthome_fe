import styles from "./StackedChartBar.module.scss";
import classNames from "classnames/bind";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const cx = classNames.bind(styles);

const PALETTE_COLORS = [
  "#FF5733",
  "#33B5FF",
  "#69b089ff",
  "#e2b34dff",
  "#FF336E",
  "#FF338D",
  "#c94edfff",
  "#FF33B5",
  "#33FFDB",
  "#8D33FF",
  "#33FF57",
  "#FF8D33",
  "#336EFF",
  "#FFD133",
  "#A233FF",
  "#33FFF0",
  "#33A2FF",
  "#D1FF33",
  "#FF3333",
  "#33FFB5",
];

const getUniqueCategories = (data) => {
  const categories = new Set();
  data.forEach((item) => categories.add(item.category));
  return Array.from(categories);
};
function StackChartComponent({ compositeProductPredictedData }) {
  const uniqueCategories = getUniqueCategories(compositeProductPredictedData);
  const stackedDataMap = compositeProductPredictedData.reduce((acc, item) => {
    const brand = item.brand;
    const category = item.category;

    if (!acc[brand]) {
      acc[brand] = { brand: brand.toUpperCase() };
    }

    acc[brand][category] = item.totalStemp;

    return acc;
  }, {});
  const chartData = Object.values(stackedDataMap);

  const renderTooltipContent = (props) => {
    const { active, payload, label } = props;

    if (active && payload && payload.length) {
      let brandTotal = 0;

      payload.forEach((entry) => {
        brandTotal += entry.value || 0;
      });

      return (
        <div
          style={{
            backgroundColor: "#fff",
            padding: "10px",
            border: "1px solid #ccc",
            fontSize: 14,
          }}
        >
          <p style={{ fontWeight: "bold" }}>{`Hãng: ${label}`}</p>
          <p
            style={{
              borderBottom: "1px solid #eee",
              paddingBottom: 5,
              marginBottom: 5,
            }}
          >
            {`Tổng Stemp: ${brandTotal.toFixed(3)}`}
          </p>

          {payload.map((entry, index) => {
            const value = entry.value || 0;
            const percentage =
              brandTotal > 0 ? ((value / brandTotal) * 100).toFixed(1) : 0;

            return (
              <p
                key={`item-${index}`}
                style={{ color: entry.color, margin: 0 }}
              >
                {`${entry.name}: ${value.toFixed(3)} (${percentage}%)`}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <h3>Phân Bổ Tỉ lệ đặt hàng theo HÃNG và LOẠI</h3>
        <div className={cx("stacked-bar-chart")}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="brand" />

              <YAxis
                label={{
                  value: "Tỷ lệ đặt hàng",
                  angle: -90,
                  position: "insideLeft",
                }}
              />

              <Tooltip content={renderTooltipContent} />

              <Legend wrapperStyle={{ paddingTop: "20px" }} />

              {uniqueCategories.map((category, index) => (
                <Bar
                  key={category}
                  dataKey={category}
                  stackId="a"
                  fill={PALETTE_COLORS[index % PALETTE_COLORS.length]}
                  name={category.toUpperCase()}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default StackChartComponent;
