import styles from "./PieChart.module.scss";
import classNames from "classnames/bind";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
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

function PieChartComponent({ compositeProductPredictedData }) {
  const getTotalsByColumn = (key) =>
    compositeProductPredictedData.reduce((acc, item) => {
      const column = item[key];

      if (!acc[column]) {
        acc[column] = 0;
      }

      acc[column] += item.totalStemp;

      return acc;
    }, {});

  const getColorByIndex = (index) =>
    PALETTE_COLORS[index % PALETTE_COLORS.length];

  const getByBrand = Object.keys(getTotalsByColumn("brand")).map(
    (brand, index) => ({
      name: brand.toUpperCase(),
      value: getTotalsByColumn("brand")[brand],
      color: getColorByIndex(index),
    })
  );

  const getByCategory = Object.keys(getTotalsByColumn("category")).map(
    (category, index) => ({
      name: category.toUpperCase(),
      value: getTotalsByColumn("category")[category],
      color: getColorByIndex(index),
    })
  );
  const totalSum = (key) => {
    if (key === "brand")
      return getByBrand.reduce((sum, entry) => sum + entry.value, 0);
    if (key === "category")
      return getByCategory.reduce((sum, entry) => sum + entry.value, 0);
  };

  const renderTooltipContent = (active, payload, key) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      return (
        <div
          style={{
            backgroundColor: "#fff",
            padding: "10px",
            border: "1px solid #ccc",
            fontSize: 14,
          }}
        >
          <p
            style={{ color: data.color, fontWeight: "bold" }}
          >{`${data.name}`}</p>
          <p>{`Tổng đơn bán được: ${data.value.toFixed(3)}`}</p>

          <p>{`Tỷ lệ: ${parseInt((data.value * 100) / totalSum(key))}%`}</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({
    name,
    percent,
    x,
    y,
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    index,
  }) => {
    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="700 !important"
      >
        {`${name} (${(percent * 100).toFixed(1)}%)`}
      </text>
    );
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <h3>Biểu đồ tỷ lệ đặt hàng theo LOẠI</h3>
        <div className={cx("pie-chart")}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={getByCategory}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={130}
                fill="#8884d8"
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {getByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>

              <Tooltip
                content={({ active, payload }) =>
                  renderTooltipContent(active, payload, "category")
                }
              />

              {/* <Legend
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
                formatter={(value, entry) => (
                  <span style={{ color: entry.color }}>{value}</span>
                )}
              /> */}
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className={cx("container")}>
        <h3>Biểu đồ tỷ lệ đặt hàng theo HÃNG</h3>
        <div className={cx("pie-chart")}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={getByBrand}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={130}
                fill="#8884d8"
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {getByBrand.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>

              <Tooltip
                content={({ active, payload }) =>
                  renderTooltipContent(active, payload, "brand")
                }
              />

              {/* <Legend
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
                formatter={(value, entry) => (
                  <span style={{ color: entry.color }}>{value}</span>
                )}
              /> */}
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default PieChartComponent;
