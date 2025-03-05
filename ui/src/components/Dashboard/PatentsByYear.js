import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import URLs from "../../constants/urls";

const PatentYearChart = ({ startDate, endDate }) => {
  const [data, setData] = useState([]);
  const [defaultStartDate, setDefaultStartDate] = useState(null);
  const [defaultEndDate, setDefaultEndDate] = useState(null);

  useEffect(() => {
    axios
      .get(URLs.PATENT_BY_YEAR, {
        headers: { "X-TESTER-REQUEST": "tester_secret_api_key" },
      })
      .then((response) => {
        if (response.data) {
          const sortedData = response.data
            .map((item) => ({
              id: Number(item._id), // Using _id as the year
              count: item.count,
            }))
            .sort((a, b) => a.id - b.id);

          // Calculate min and max year for default date range
          const minYear = Math.min(...sortedData.map((item) => item.id));
          const maxYear = Math.max(...sortedData.map((item) => item.id));

          // Set the default start and end dates based on the available data range
          setDefaultStartDate(new Date(minYear, 0, 1)); // January 1st of the earliest year
          setDefaultEndDate(new Date(maxYear, 11, 31)); // December 31st of the latest year

          // Filter the data based on the selected date range
          const filteredData = sortedData.filter(
            (item) =>
              item.id >= startDate.getFullYear() &&
              item.id <= endDate.getFullYear()
          );

          setData(filteredData);
          console.log("Filtered data points:", filteredData.length);
        }
      })
      .catch((error) => console.error("Error fetching patent data:", error));
  }, [startDate, endDate]); // Re-run when startDate or endDate changes

  // Show a loading state until the default dates are set
  if (defaultStartDate === null || defaultEndDate === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* <h3>Patents by Year</h3> */}
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 40, left: 120, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="id" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PatentYearChart;
