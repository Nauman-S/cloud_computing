import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import SignUp from "./components/Signup/Signup";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "./components/Nav/Nav";
import Status from "./components/oAuth2/Status";

function App() {
  return (
    <BrowserRouter>
      <Nav></Nav>
      <div className="App">
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/status" element={<Status />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
