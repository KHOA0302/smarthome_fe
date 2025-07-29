import styles from "./ProductStatistic.module.scss";
import classNames from "classnames/bind";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
];

const cx = classNames.bind(styles);

const CustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
  name,
  value,
}) => {
  const RADIAN = Math.PI / 180;

  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#ccccc"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
    >
      {`${name} (${(percent * 100).toFixed(0)}%)`}{" "}
    </text>
  );
};

function ProductStatistic({ products, quarterName }) {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("chart")}>
          <h3>
            Tỷ lệ các mặt hàng đã bán trong <span>{quarterName}</span>
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={products}
                dataKey="sold_quantity"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                labelLine={false}
              >
                {products?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, props) => [
                  `${value} cái`,
                  `${props.payload.name}`,
                ]}
              />
              <Legend
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ paddingTop: "10px" }}
                formatter={(value, entry) =>
                  `${value}: ${entry.payload.sold_quantity} cái (${entry.payload.rate}%)`
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className={cx("order")}></div>
      </div>
    </div>
  );
}

export default ProductStatistic;
