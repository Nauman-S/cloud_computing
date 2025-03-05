import React, { useEffect, useState, useMemo } from "react";
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

const PatentCountryChart = ({ startDate, endDate, topX }) => {
  const [data, setData] = useState([]);
  const [noCountryCount, setNoCountryCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(URLs.PATENT_BY_COUNTRY, {
          headers: { "X-TESTER-REQUEST": "tester_secret_api_key" },
        });
        if (response.data) {
          let localNoCountryCount = 0;
          const chartData = response.data.reduce((acc, item) => {
            if (item._id === "") {
              // Sum counts for items with no country data.
              localNoCountryCount += item.count;
            } else {
              acc.push({
                country: item._id,
                count: item.count,
              });
            }
            return acc;
          }, []);

          // Update state for the no country count.
          setNoCountryCount(localNoCountryCount);

          // Filter out items with empty _id, sort by count in descending order, and slice to top X items.
          const topChartData = chartData
            .filter((item) => item.country !== "") // Filtering out empty country
            .sort((a, b) => b.count - a.count) // Sorting in descending order by count
            .slice(0, topX); // Slicing to get the top X items

          // Update state with the processed chart data
          setData(topChartData);
        }
      } catch (error) {
        console.error("Error fetching patent data:", error);
      }
    };

    fetchData();
  }, [topX]);

  // Dynamically compute the chart height based on number of items
  const MIN_CHART_HEIGHT = 350;
  const HEIGHT_PER_ITEM = 40;
  const chartHeight = Math.max(MIN_CHART_HEIGHT, data.length * HEIGHT_PER_ITEM);

  // Dynamically measure the widest label to set the YAxis width
  const yAxisWidth = useMemo(() => {
    if (!data.length) return 100; // fallback

    // Create a canvas for measuring text
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set the font to match Recharts (or your own CSS)
    // Adjust as needed, e.g. '14px Roboto, sans-serif'
    ctx.font = "14px sans-serif";

    // Find the maximum width among all labels
    const maxLabelWidth = data.reduce((acc, item) => {
      const metrics = ctx.measureText(item.applicant);
      return Math.max(acc, metrics.width);
    }, 0);

    // Add some padding so text isn’t flush against the axis line
    return Math.ceil(maxLabelWidth) + 20;
  }, [data]);

  return (
    <div>
      <h4>Top {topX} Countries</h4>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <ResponsiveContainer width="100%" height={700}>
          <BarChart
            width={600}
            height={300}
            data={data}
            layout="vertical"
            margin={{ top: 20, right: 40, left: 60, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <YAxis
              dataKey="country"
              type="category"
              width={yAxisWidth}
              interval={0}
            />

            <XAxis type="number" />
            <Tooltip />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
        {noCountryCount > 0 && (
          <div style={{ marginTop: "20px", fontStyle: "italic" }}>
            Note: {noCountryCount} applications have no country indicated.
          </div>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default PatentCountryChart;
