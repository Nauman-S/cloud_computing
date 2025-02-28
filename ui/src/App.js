import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import SignUp from "./components/Signup/Signup";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "./components/Nav/Nav";
import Dashboard from "./components/Dashboard/Dashboard";
import PatentsByYear from "./components/Dashboard/PatentsByYear";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./components/Dashboard/test_theme";

function App() {
  // return (
  //   <ThemeProvider theme={theme}>
  //     <Dashboard />
  //   </ThemeProvider>
  // );
  return <Dashboard></Dashboard>;
  // return <PatentsByYear></PatentsByYear>;
}

export default App;

// function App() {
//   return (
//     <BrowserRouter>
//       <Nav></Nav>
//       <div className="App">
//         <Routes>

//           <Route path="/signup" element={<SignUp/>} />
//         </Routes>

//       </div>
//     </BrowserRouter>
//   );
// }

// export default App;
