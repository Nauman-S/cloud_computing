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

const PatentCountryChart = ({ startDate, endDate }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const query = `&startDate=${
        startDate.toISOString().split("T")[0]
      }&endDate=${endDate.toISOString().split("T")[0]}`;
      try {
        const response = await axios.get(URLs.PATENT_BY_COUNTRY + query, {
          headers: { "X-TESTER-REQUEST": "tester_secret_api_key" },
        });
        if (response.data) {
          const chartData = response.data
            .map((item) => ({
              country: item._id,
              count: item.count,
            }))
            .sort((a, b) => b.count - a.count);
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
      <h3>Patents by Country</h3>
      <ResponsiveContainer width="100%" height={1000}>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart
            width={600}
            height={300}
            data={data}
            layout="vertical"
            margin={{ top: 20, right: 40, left: 60, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            {/* <XAxis dataKey="country" />
            <YAxis /> */}
            <YAxis dataKey="country" type="category" />

            <XAxis type="number" />
            <Tooltip />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </ResponsiveContainer>
    </div>
  );
};

export default PatentCountryChart;
