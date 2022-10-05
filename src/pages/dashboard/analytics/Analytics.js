import { Box, Paper } from "@mui/material";
import { useEffect } from "react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";

const Analytics = ({ setSelectedLink, link }) => {
  const data = [
    { name: "January", value: 400 },
    { name: "February", value: 500 },
    { name: "March", value: 300 },
    { name: "April", value: 200 },
    { name: "May", value: 200 },
    { name: "June", value: 300 },
    { name: "July", value: 500 },
    { name: "August", value: 800 },
    { name: "September", value: 500 },
    { name: "October", value: 800 },
    { name: "November", value: 700 },
    { name: "Decemer", value: 900 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  useEffect(() => {
    setSelectedLink(link);
  }, []);
  return (
    <Box display="flex" flexDirection="column">
      <Paper elevation={3}>
        <PieChart width={500} height={400}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={true}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </Paper>
    </Box>
  );
};

export default Analytics;
