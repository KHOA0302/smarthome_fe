import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import styles from "./RevenueStatistic.module.scss";
import classNames from "classnames/bind";
import { formatNumber } from "../../utils/formatNumber";
const cx = classNames.bind(styles);
function RevenueStatistic({ revenue }) {
  const transformedData = revenue.flatMap((yearData) => {
    return yearData.quarters.map((quarter) => ({
      name: `${yearData.year} - ${quarter.name}`,
      revenue: quarter.revenue,
    }));
  });

  return (
    <div className={cx("wrapper")}>
      {
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={transformedData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />

            <XAxis
              dataKey="name"
              angle={-30}
              textAnchor="end"
              height={80}
              tick={{ fill: "#555", fontSize: 12 }}
              tickLine={{ stroke: "#ccc" }}
            />
            <YAxis
              tickFormatter={(value) =>
                `${formatNumber(value / 1000000)} triệu`
              }
              tick={{ fill: "#555", fontSize: 12 }}
              tickLine={{ stroke: "#ccc" }}
            />
            <Tooltip
              formatter={(value) => [`${formatNumber(value)}đ`, "Doanh thu"]} // Custom tooltip format
              labelFormatter={(label) => `Thời gian: ${label}`} // Custom label format for tooltip
              contentStyle={{
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }} // Tooltip styling
            />
            <Legend
              verticalAlign="top" // Position legend at the top
              height={36} // Height of the legend area
              wrapperStyle={{ paddingTop: "10px" }} // Padding for the legend
            />
            <Line
              type="monotone" // Smooth line
              dataKey="revenue" // Data key for the line, now using 'revenue'
              stroke="#1f3c88" // Line color
              strokeWidth={2} // Line thickness
              activeDot={{ r: 8 }} // Larger dot when hovered
              name="Tổng Doanh thu" // Name for the legend
            />
          </LineChart>
        </ResponsiveContainer>
      }
    </div>
  );
}

export default RevenueStatistic;
