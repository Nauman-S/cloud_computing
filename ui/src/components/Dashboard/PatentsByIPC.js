import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import URLs from "../../constants/urls";

const PatentIPCChart = ({ startDate, endDate }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const query = `&startDate=${
        startDate.toISOString().split("T")[0]
      }&endDate=${endDate.toISOString().split("T")[0]}`;
      try {
        const response = await axios.get(URLs.PATENT_BY_IPC + query, {
          headers: { "X-TESTER-REQUEST": "tester_secret_api_key" },
        });
        if (response.data) {
          const chartData = response.data.map((item) => ({
            ipc: item._id,
            count: item.count,
          }));
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
      <h3>Patents by IPC Classification</h3>
      <BarChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="ipc" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#d88484" />
      </BarChart>
    </div>
  );
};

export default PatentIPCChart;
