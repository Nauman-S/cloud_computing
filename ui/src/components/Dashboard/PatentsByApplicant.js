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

function toTitleCase(str) {
  // Splits on whitespace/punctuation, capitalizes each word
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  );
}

const PatentApplicantChart = ({ topX }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(URLs.PATENT_BY_APPLICANT, {
          headers: { "X-TESTER-REQUEST": "tester_secret_api_key" },
        });

        if (response.data && Array.isArray(response.data)) {
          // 1) Aggregate data by lower-cased name so duplicates merge
          const aggregator = {};

          response.data.forEach((item) => {
            if (!item._id || typeof item.count !== "number") return;

            // Trim & lower-case for the aggregator key
            const canonicalName = item._id.trim().toLowerCase();
            if (!aggregator[canonicalName]) {
              aggregator[canonicalName] = 0;
            }
            aggregator[canonicalName] += item.count;
          });

          // 2) Convert aggregator object back into an array
          //    and title-case the final name
          const mergedData = Object.entries(aggregator).map(([key, count]) => ({
            applicant: toTitleCase(key), // "qualcomm" -> "Qualcomm"
            count,
          }));

          // 3) Sort & slice
          const sortedData = mergedData
            .sort((a, b) => b.count - a.count)
            .slice(0, topX);

          setData(sortedData);
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
      <h4>Top {topX} Applicants</h4>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 40, left: 10, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <YAxis
            dataKey="applicant"
            type="category"
            width={yAxisWidth}
            interval={0} // to ensure no labels are skipped
            tickMargin={8} // some spacing between label text and axis
          />
          <XAxis type="number" />
          <Tooltip />
          <Bar dataKey="count" fill="#ff7300" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PatentApplicantChart;
