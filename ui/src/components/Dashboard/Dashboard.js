// import React, { useState } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import Select from "react-select";
// import {
//   Container,
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   InputAdornment,
//   Skeleton,
//   useTheme,
// } from "@mui/material";
// import { CalendarToday, FilterList } from "@mui/icons-material";
// import { styled } from "@mui/system";
// import PatentStatusChart from "./PatentsByStatus";
// import PatentYearChart from "./PatentsByYear";
// import PatentApplicantChart from "./PatentsByApplicant";
// import PatentCountryChart from "./PatentsByCountry";
// import PatentIPCChart from "./PatentsByIPC";

// // Custom styled components
// const DashboardHeader = styled("div")(({ theme }) => ({
//   display: "flex",
//   alignItems: "center",
//   marginBottom: theme.spacing(4),
//   padding: theme.spacing(2),
//   backgroundColor: theme.palette.background.paper,
//   borderRadius: theme.shape.borderRadius,
//   boxShadow: theme.shadows[2],
// }));

// const ChartContainer = styled(Card)(({ theme }) => ({
//   height: "100%",
//   transition: "transform 0.2s, box-shadow 0.2s",
//   "&:hover": {
//     transform: "translateY(-4px)",
//     boxShadow: theme.shadows[4],
//   },
// }));

// const Dashboard = () => {
//   const theme = useTheme();
//   const [startDate, setStartDate] = useState(new Date("2020-01-01"));
//   const [endDate, setEndDate] = useState(new Date());
//   const [topX, setTopX] = useState(10);

//   const topXOptions = [
//     { value: 5, label: "Top 5" },
//     { value: 10, label: "Top 10" },
//     { value: 20, label: "Top 20" },
//   ];

//   // Custom select styles
//   const selectStyles = {
//     control: (base) => ({
//       ...base,
//       minHeight: "40px",
//       borderColor: theme.palette.divider,
//     }),
//     menuPortal: (base) => ({ ...base, zIndex: 9999 }),
//     option: (base, state) => ({
//       ...base,
//       backgroundColor: state.isSelected
//         ? theme.palette.primary.main
//         : "transparent",
//       "&:hover": {
//         backgroundColor: theme.palette.action.hover,
//       },
//     }),
//   };

//   return (
//     <Container maxWidth="xl">
//       <DashboardHeader>
//         <FilterList color="primary" sx={{ mr: 2, fontSize: 40 }} />
//         <Typography variant="h4" component="h1">
//           Patent Analytics Dashboard
//           <Typography variant="body1" color="textSecondary">
//             Interactive visualization of patent statistics
//           </Typography>
//         </Typography>
//       </DashboardHeader>

//       {/* Filters Section */}
//       <Card sx={{ mb: 4, boxShadow: 3 }}>
//         <CardContent>
//           <Grid container spacing={3} alignItems="center">
//             <Grid item xs={12} md={4}>
//               <TextField
//                 fullWidth
//                 label="Start Date"
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <CalendarToday color="action" />
//                     </InputAdornment>
//                   ),
//                 }}
//                 component={() => (
//                   <DatePicker
//                     selected={startDate}
//                     onChange={setStartDate}
//                     customInput={<TextField fullWidth />}
//                     popperPlacement="bottom-start"
//                   />
//                 )}
//               />
//             </Grid>
//             <Grid item xs={12} md={4}>
//               <TextField
//                 fullWidth
//                 label="End Date"
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <CalendarToday color="action" />
//                     </InputAdornment>
//                   ),
//                 }}
//                 component={() => (
//                   <DatePicker
//                     selected={endDate}
//                     onChange={setEndDate}
//                     customInput={<TextField fullWidth />}
//                     popperPlacement="bottom-start"
//                   />
//                 )}
//               />
//             </Grid>
//             <Grid item xs={12} md={4}>
//               <Typography variant="subtitle2" gutterBottom>
//                 Top Applicants Selection
//               </Typography>
//               <Select
//                 options={topXOptions}
//                 defaultValue={topXOptions[1]}
//                 onChange={(option) => setTopX(option.value)}
//                 styles={selectStyles}
//                 menuPortalTarget={document.body}
//                 isSearchable={false}
//               />
//             </Grid>
//           </Grid>
//         </CardContent>
//       </Card>

//       {/* Charts Grid */}
//       <Grid container spacing={4}>
//         {[
//           PatentStatusChart,
//           PatentYearChart,
//           PatentApplicantChart,
//           PatentCountryChart,
//           PatentIPCChart,
//         ].map((ChartComponent, index) => (
//           <Grid item xs={12} md={6} key={index}>
//             <ChartContainer>
//               <CardContent sx={{ height: "100%" }}>
//                 <ChartComponent
//                   startDate={startDate}
//                   endDate={endDate}
//                   topX={topX}
//                   LoadingFallback={
//                     <Skeleton
//                       variant="rectangular"
//                       height={350}
//                       sx={{ borderRadius: 2 }}
//                     />
//                   }
//                 />
//               </CardContent>
//             </ChartContainer>
//           </Grid>
//         ))}
//       </Grid>
//     </Container>
//   );
// };

// export default Dashboard;

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { Container, Grid, Card, CardContent, Typography } from "@mui/material";
import PatentStatusChart from "./PatentsByStatus";
import PatentYearChart from "./PatentsByYear";
import PatentApplicantChart from "./PatentsByApplicant";
import PatentCountryChart from "./PatentsByCountry";
import PatentIPCChart from "./PatentsByIPC";

const Dashboard = () => {
  const [startDate, setStartDate] = useState(new Date("2020-01-01"));
  const [endDate, setEndDate] = useState(new Date());
  const [topX, setTopX] = useState(10);

  const topXOptions = [
    { value: 5, label: "Top 5" },
    { value: 10, label: "Top 10" },
    { value: 20, label: "Top 20" },
  ];

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Patent Analytics Dashboard
      </Typography>

      {/* Filters Section */}
      <Card sx={{ mb: 3, p: 2 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <Typography variant="body1">Start Date:</Typography>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body1">End Date:</Typography>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body1">Top Applicants:</Typography>
              <Select
                options={topXOptions}
                defaultValue={topXOptions[1]}
                onChange={(option) => setTopX(option.value)}
                menuPortalTarget={document.body} // ✅ Render dropdown outside the Card
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }} // ✅ Ensure dropdown appears on top
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Charts Section */}
      {/*
       <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <PatentStatusChart startDate={startDate} endDate={endDate} />
        </Grid>
        <Grid item xs={12} md={6}>
          <PatentYearChart startDate={startDate} endDate={endDate} />
        </Grid>
        <Grid item xs={12} md={6}>
          <PatentApplicantChart startDate={startDate} endDate={endDate} topX={topX} />
        </Grid>
        <Grid item xs={12} md={6}>
          <PatentCountryChart startDate={startDate} endDate={endDate} />
        </Grid>
        <Grid item xs={12}>
          <PatentIPCChart startDate={startDate} endDate={endDate} />
        </Grid>
      </Grid> */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={10}>
          {" "}
          <PatentStatusChart startDate={startDate} endDate={endDate} />
        </Grid>
        <Grid item xs={12} md={10}>
          {" "}
          <PatentYearChart startDate={startDate} endDate={endDate} />
        </Grid>
        <Grid item xs={12} md={10}>
          <PatentApplicantChart
            startDate={startDate}
            endDate={endDate}
            topX={topX}
          />
        </Grid>
        <Grid item xs={12} md={10}>
          <PatentCountryChart startDate={startDate} endDate={endDate} />
        </Grid>
        <Grid item xs={12} md={10}>
          <PatentIPCChart startDate={startDate} endDate={endDate} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;

// import React, { useState } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import Select from "react-select";
// import PatentStatusChart from "./PatentsByStatus";
// import PatentYearChart from "./PatentsByYear";
// import PatentApplicantChart from "./PatentsByApplicant";
// import PatentCountryChart from "./PatentsByCountry";
// import PatentIPCChart from "./PatentsByIPC";

// const Dashboard = () => {
//   const [startDate, setStartDate] = useState(new Date("2020-01-01"));
//   const [endDate, setEndDate] = useState(new Date());
//   const [topX, setTopX] = useState(10);

//   const topXOptions = [
//     { value: 5, label: "Top 5" },
//     { value: 10, label: "Top 10" },
//     { value: 20, label: "Top 20" },
//   ];

//   return (
//     <div>
//       <h2>Patent Analytics Dashboard</h2>
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-around",
//           marginBottom: "20px",
//         }}
//       >
//         <div>
//           <label>Start Date: </label>
//           <DatePicker
//             selected={startDate}
//             onChange={(date) => setStartDate(date)}
//           />
//         </div>
//         <div>
//           <label>End Date: </label>
//           <DatePicker
//             selected={endDate}
//             onChange={(date) => setEndDate(date)}
//           />
//         </div>

//         <div>
//           <label>Top Applicants: </label>
//           <Select
//             options={topXOptions}
//             defaultValue={topXOptions[1]}
//             onChange={(option) => setTopX(option.value)}
//           />
//         </div>
//       </div>
//       <div
//         style={{
//           display: "flex",
//           flexWrap: "wrap",
//           justifyContent: "space-around",
//         }}
//       >
//         <PatentStatusChart startDate={startDate} endDate={endDate} />
//         <PatentYearChart startDate={startDate} endDate={endDate} />
//         <PatentApplicantChart
//           startDate={startDate}
//           endDate={endDate}
//           topX={topX}
//         />
//         <PatentCountryChart startDate={startDate} endDate={endDate} />
//         <PatentIPCChart startDate={startDate} endDate={endDate} />
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
