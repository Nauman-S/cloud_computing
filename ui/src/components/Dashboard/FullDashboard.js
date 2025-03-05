import React, { useState } from "react";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import PatentsDashboard from "./PatentsDashboard";

const DashboardTabs = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 2,
      }}
    >
      <Typography
        variant="h3"
        sx={{
          textAlign: "center",
          fontFamily: "'Roboto', sans-serif",
          fontWeight: "bold",
          mb: 2,
        }}
      >
        IP Analytics Dashboard
      </Typography>
      <Tabs value={activeTab} onChange={handleChange} centered>
        <Tab label="Patents" />
        <Tab label="Trademark" />
        <Tab label="Designs" />
      </Tabs>
      <Box sx={{ width: "100%", maxWidth: "1200px", mt: 3 }}>
        {activeTab === 0 && <PatentsDashboard />}
        {activeTab === 1 && <div>Trademark Dashboard (coming soon)</div>}
        {activeTab === 2 && <div>Designs Dashboard (coming soon)</div>}
      </Box>
    </Box>
  );
};

export default DashboardTabs;
