// import React, { useEffect, useState } from "react";
// // Add these imports
// import { useTheme } from "@mui/material/styles";
// // The Typography component is already correctly imported in your original code via:
// import { Typography } from "@mui/material";
// import axios from "axios";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer,
// } from "recharts";
// import URLs from "../../constants/urls";

// const PatentStatusChart = ({ startDate, endDate, LoadingFallback }) => {
//   const theme = useTheme();
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const query = `&startDate=${
//         startDate.toISOString().split("T")[0]
//       }&endDate=${endDate.toISOString().split("T")[0]}`;

//       try {
//         const response = await axios.get(URLs.PATENT_BY_STATUS + query, {
//           headers: { "X-TESTER-REQUEST": "tester_secret_api_key" },
//         });

//         if (response.data) {
//           const chartData = response.data
//             .map((item) => ({
//               status: item._id,
//               count: item.count,
//             }))
//             .sort((a, b) => a.status.localeCompare(b.status)); // Sort alphabetically

//           setData(chartData);
//         }
//       } catch (error) {
//         console.error("Error fetching patent data:", error);
//       }
//     };

//     fetchData();
//   }, [startDate, endDate]);

//   return (
//     <div style={{ position: "relative", height: "100%" }}>
//       <Typography variant="h6" gutterBottom sx={{ color: "text.primary" }}>
//         Patents by Status
//         <Typography variant="body2" color="textSecondary">
//           Distribution of patents by current legal status
//         </Typography>
//       </Typography>

//       {data.length === 0 ? (
//         LoadingFallback
//       ) : (
//         <ResponsiveContainer width="100%" height={350}>
//           <BarChart
//             data={data}
//             layout="vertical"
//             margin={{ top: 20, right: 20, left: 100, bottom: 20 }}
//           >
//             <CartesianGrid
//               strokeDasharray="3 3"
//               stroke={theme.palette.divider}
//             />
//             <YAxis
//               dataKey="status"
//               type="category"
//               tick={{ fill: theme.palette.text.primary }}
//               tickFormatter={(value) =>
//                 value.length > 20 ? `${value.slice(0, 20)}...` : value
//               }
//             />
//             <XAxis
//               type="number"
//               tick={{ fill: theme.palette.text.secondary }}
//             />
//             <Tooltip
//               contentStyle={{
//                 backgroundColor: theme.palette.background.paper,
//                 borderColor: theme.palette.divider,
//                 borderRadius: theme.shape.borderRadius,
//               }}
//             />
//             <Bar
//               dataKey="count"
//               fill={theme.palette.primary.main}
//               radius={[0, 4, 4, 0]}
//               animationBegin={100}
//             />
//           </BarChart>
//         </ResponsiveContainer>
//       )}
//     </div>
//   );
// };

// export default PatentStatusChart;

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import URLs from "../../constants/urls";

const PatentStatusChart = ({ startDate, endDate }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const query = `&startDate=${
        startDate.toISOString().split("T")[0]
      }&endDate=${endDate.toISOString().split("T")[0]}`;

      try {
        const response = await axios.get(URLs.PATENT_BY_STATUS + query, {
          headers: { "X-TESTER-REQUEST": "tester_secret_api_key" },
        });

        if (response.data) {
          const chartData = response.data
            .map((item) => ({
              status: item._id,
              count: item.count,
            }))
            .sort((a, b) => a.status.localeCompare(b.status)); // Sort alphabetically

          setData(chartData);
        }
      } catch (error) {
        console.error("Error fetching patent data:", error);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  return (
    <div>
      <h3>Patents by Status</h3>
      <ResponsiveContainer width="100%" height={350}>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            layout="vertical" // ✅ Horizontal bars
            margin={{ top: 20, right: 40, left: 60, bottom: 20 }} // ✅ More left margin for labels
          >
            <CartesianGrid strokeDasharray="3 3" />

            <YAxis dataKey="status" type="category" width={180} />

            <XAxis type="number" />

            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>

        {/* <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="status"
            angle={-20}
            textAnchor="end"
            interval={0}
            // tickFormatter={(label) =>
            //   label.length > 10 ? `${label.slice(0, 10)}...` : label
            // }
          />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart> */}
      </ResponsiveContainer>
    </div>
  );
};

export default PatentStatusChart;
