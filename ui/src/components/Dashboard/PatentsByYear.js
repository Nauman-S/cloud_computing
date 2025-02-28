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

const PatentYearChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(URLs.PATENT_BY_YEAR, {
        headers: { "X-TESTER-REQUEST": "tester_secret_api_key" },
      })
      .then((response) => {
        if (response.data) {
          // Here we assume you want to display counts for different patent IDs (or categories)
          const chartData = response.data
            .map((item, index) => ({
              id: Number(item._id), // Using _id as the key on the X-Axis
              count: item.count,
            }))
            .sort((a, b) => a.id - b.id);
          setData(chartData);
          console.log("Number of data points:", data.length);
        }
      })
      .catch((error) => console.error("Error fetching patent data:", error));
  }, []);

  return (
    <div>
      <h3>Patents by Year</h3>
      <ResponsiveContainer width="100%" height={350}>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart
            width={600}
            height={300}
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
      </ResponsiveContainer>
      {/* <LineChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="id" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="count" stroke="#82ca9d" />
      </LineChart> */}
    </div>
  );
};

export default PatentYearChart;
