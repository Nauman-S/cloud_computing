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

const PatentApplicantChart = ({ startDate, endDate, topX }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const query = `&startDate=${
        startDate.toISOString().split("T")[0]
      }&endDate=${endDate.toISOString().split("T")[0]}`;
      try {
        const response = await axios.get(URLs.PATENT_BY_APPLICANT + query, {
          headers: { "X-TESTER-REQUEST": "tester_secret_api_key" },
        });
        if (response.data) {
          const sortedData = response.data
            .map((item) => ({
              applicant: item._id,
              count: item.count,
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, topX); // Select top X applicants
          setData(sortedData);
        }
      } catch (error) {
        console.error("Error fetching patent data:", error);
      }
    };

    fetchData();
  }, [startDate, endDate, topX]);

  return (
    <div>
      <h3>Top {topX} Patent Applicants</h3>
      <ResponsiveContainer width="100%" height={350}>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            width={600}
            height={300}
            data={data}
            margin={{ top: 20, right: 40, left: 120, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="applicant" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#ff7300" />
          </BarChart>
        </ResponsiveContainer>
      </ResponsiveContainer>
    </div>
  );
};

export default PatentApplicantChart;
