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
import { prepareAxiosRequestConfig } from "../oAuth2/OAuth";

const PatentStatusChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(URLs.PATENT_BY_STATUS, prepareAxiosRequestConfig());

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
  }, []);

  return (
    <div>
      {/* <h3>Patents by Status</h3> */}
      <ResponsiveContainer width="100%" height={350}>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 20, right: 40, left: 60, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <YAxis dataKey="status" type="category" width={180} />

            <XAxis type="number" />

            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </ResponsiveContainer>
    </div>
  );
};

export default PatentStatusChart;
