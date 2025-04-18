import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import PatentStatusChart from "./PatentsByStatus";
import PatentYearChart from "./PatentsByYear";
import PatentIPCChart from "./PatentsByIPC";
import PatentApplicantChart from "./PatentsByApplicant";
import PatentCountryChart from "./PatentsByCountry";

const Dashboard = () => {
  const [startDate, setStartDate] = useState(new Date(2004, 1, 1));
  const [endDate, setEndDate] = useState(new Date());
  const [topApplicants, setTopApplicants] = useState(10);
  const [topCountries, setTopCountries] = useState(10);

  const topXOptions = [
    { value: 5, label: "Top 5" },
    { value: 10, label: "Top 10" },
    { value: 20, label: "Top 20" },
    { value: 30, label: "Top 30" },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* 1. Patents by Status */}
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h4">Patents by Status</Typography>
              <PatentStatusChart startDate={startDate} endDate={endDate} />
            </CardContent>
          </Card>
        </Grid>

        {/* 2. Patents by Filing Year */}
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h4">Patents by Filing Year</Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <DatePicker
                    selected={startDate}
                    onChange={setStartDate}
                    showYearDropdown
                    scrollableYearDropdown
                    dateFormat="yyyy/MM/dd"
                  />
                  <DatePicker
                    selected={endDate}
                    onChange={setEndDate}
                    showYearDropdown
                    scrollableYearDropdown
                    dateFormat="yyyy/MM/dd"
                  />
                </Box>
              </Box>
              <PatentYearChart startDate={startDate} endDate={endDate} />
            </CardContent>
          </Card>
        </Grid>

        {/* 3. Patents by Subject Area */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h4">Patents by Subject Area</Typography>
              <PatentIPCChart startDate={startDate} endDate={endDate} />
            </CardContent>
          </Card>
        </Grid>

        {/* 4. Patents by Applicants & Applicant's Country side-by-side */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h4">Patents by Applicant Names</Typography>
                <Select
                  options={topXOptions}
                  value={topXOptions.find((opt) => opt.value === topApplicants)}
                  onChange={(option) => setTopApplicants(option.value)}
                  styles={selectStyles}
                />
              </Box>
              <PatentApplicantChart
                startDate={startDate}
                endDate={endDate}
                topX={topApplicants}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h4">
                  Patents by Applicant's Country
                </Typography>
                <Select
                  options={topXOptions}
                  value={topXOptions.find((opt) => opt.value === topCountries)}
                  onChange={(option) => setTopCountries(option.value)}
                  styles={selectStyles}
                />
              </Box>
              <PatentCountryChart
                startDate={startDate}
                endDate={endDate}
                topX={topCountries}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

// Custom styled component for react-select
const selectStyles = {
  container: (base) => ({
    ...base,
    minWidth: 120,
    zIndex: 1000,
  }),
};

export default Dashboard;
