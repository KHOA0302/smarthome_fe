import {
  ComposedChart,
  Line,
  Bar,
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

const CustomDot = (props) => {
  const { cx, cy, stroke, payload, highlightedQuarterLabel } = props;

  if (payload.name === highlightedQuarterLabel) {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill="#ff0000"
        stroke="#fff"
        strokeWidth={2}
      />
    );
  }

  return (
    <circle cx={cx} cy={cy} r={3} fill={stroke} stroke="#fff" strokeWidth={1} />
  );
};

const CustomBar = (props) => {
  const { x, y, width, height, fill, payload, highlightedQuarterLabel } = props;

  if (payload.name === highlightedQuarterLabel) {
    return (
      <rect x={x} y={y} width={width} height={height} fill="#FF6347" rx={3} />
    );
  }

  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
      onClick={() => console.log(payload)}
      rx={3}
    />
  );
};

function RevenueStatistic({ revenues, currentQuarter }) {
  let groupQuarters = revenues
    .filter((revenue) => revenue.year === currentQuarter.year)[0]
    ?.quarters.map((quarter) => {
      return {
        ...quarter,
        year: currentQuarter.year,
      };
    });

  if (groupQuarters?.length < 4) {
    for (var i = 0; i < 4 - groupQuarters.length; i++) {
      const a = revenues
        .filter((revenue) => revenue.year === currentQuarter.year - 1)[0]
        .quarters.map((quarter) => {
          return {
            ...quarter,
            year: currentQuarter.year - 1,
          };
        });

      groupQuarters = [...[a[a.length - 1 - i]], ...groupQuarters];
    }
  }

  const transformedData = groupQuarters?.map((quarter, id) => {
    return {
      name: `${quarter.year} - ${quarter.name}`,
      revenue: quarter.revenue,
    };
  });

  return (
    <div className={cx("wrapper")}>
      <h2>Biểu đồ doanh thu theo quý</h2>
      <div className={cx("container")}>
        {
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
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
                textAnchor="middle"
                height={80}
                tick={{ fill: "#555", fontSize: 16 }}
                tickLine={{ stroke: "#ccc" }}
              />
              <YAxis
                tickFormatter={(value) =>
                  `${formatNumber(value / 1000000)} triệu`
                }
                tick={{ fill: "#555", fontSize: 16 }}
                tickLine={{ stroke: "#ccc" }}
              />
              <Tooltip
                formatter={(value) => [`${formatNumber(value)}đ`, "Doanh thu"]}
                labelFormatter={(label) => `Thời gian: ${label}`}
                contentStyle={{
                  borderRadius: "8px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                }}
              />

              <Bar
                dataKey="revenue"
                fill="#2781ea"
                barSize={50}
                shape={
                  <CustomBar
                    highlightedQuarterLabel={`${currentQuarter.year} - ${currentQuarter.name}`}
                  />
                }
              />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#ff8c00"
                strokeWidth={2}
                activeDot={{ r: 8 }}
                dot={
                  <CustomDot
                    highlightedQuarterLabel={`${currentQuarter.year} - ${currentQuarter.name}`}
                  />
                }
                name="Tổng Doanh thu"
              />
            </ComposedChart>
          </ResponsiveContainer>
        }
      </div>
    </div>
  );
}

export default RevenueStatistic;
