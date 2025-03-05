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

const PatentIPCChart = ({ startDate, endDate }) => {
  const [data, setData] = useState([]);

  // Helper function to group IPC codes into categories based on your rules
  const groupIPC = (ipc) => {
    if (!ipc || ipc.trim() === "") return "Unknown IPC";
    // First Priority: Quantum Computing (more specialized than AI/ML)
    if (/^G06X/.test(ipc)) return "Quantum Computing";
    // Second Priority: AI/ML Technologies
    if (/^G06F/.test(ipc) || /^G06N/.test(ipc)) return "AI/ML Technology";
    // Third Priority: Blockchain & Cryptography
    if (/^H04L/.test(ipc)) return "Blockchain & Cryptography";
    // Fourth Priority: Biotechnology
    if (/^C12N/.test(ipc)) return "Biotechnology";
    // Fifth Priority: Robotics & Automation
    if (/^B25J/.test(ipc)) return "Robotics & Automation";
    // Sixth Priority: Advanced Materials
    if (/^C08K/.test(ipc)) return "Advanced Materials";
    // Seventh Priority: Neuroscience & BCIs
    if (/^A61K/.test(ipc)) return "Neuroscience & BCIs";

    // Default grouping based on the starting letter
    if (/^A/.test(ipc)) return "Human Necessities";
    if (/^B/.test(ipc)) return "Engineering & Manufacturing";
    if (/^C/.test(ipc) || /^D/.test(ipc)) return "Chemistry & Materials";
    if (/^F/.test(ipc)) return "Engineering & Manufacturing";
    if (/^G/.test(ipc)) return "Physics & Electronics";
    if (/^H/.test(ipc)) return "Physics & Electronics";

    // If no match is found, group as "Others"
    return "Others";
  };

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
          // Group and sum counts by the custom category
          const groupedData = response.data.reduce((acc, item) => {
            const category = groupIPC(item._id);
            if (acc[category]) {
              acc[category].count += item.count;
            } else {
              acc[category] = { ipc: category, count: item.count };
            }
            return acc;
          }, {});
          const chartData = Object.values(groupedData).sort((a, b) => {
            if (a.ipc === "Others") return 1;
            if (b.ipc === "Others") return -1;
            return a.ipc.localeCompare(b.ipc);
          });
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
      {/* <h3>Patents by Subject Area</h3> */}
      <ResponsiveContainer width="100%" height={350}>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 20, right: 40, left: 60, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <YAxis dataKey="ipc" type="category" interval={0} width={180} />
            <XAxis type="number" />
            <Tooltip />
            <Bar dataKey="count" fill="#d88484" />
          </BarChart>
        </ResponsiveContainer>
      </ResponsiveContainer>
    </div>
  );
};

export default PatentIPCChart;
