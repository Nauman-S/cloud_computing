import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import SignUp from "./components/Signup/Signup";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "./components/Nav/Nav";
import FullDashboard from "./components/Dashboard/FullDashboard";
import SearchComponent from "./components/Search/Search";
function App() {
  return (
    <BrowserRouter>
      <Nav></Nav>
      <div className="App">
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/analytics" element={<FullDashboard/>} />
          <Route path="/services" element={<SearchComponent/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
