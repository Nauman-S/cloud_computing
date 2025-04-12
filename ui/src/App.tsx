import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import SignUp from "./components/Signup/Signup";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "./components/Nav/Nav";
import Status from "./components/oAuth2/Status";
import Chat from "./components/Chat/Chat";
import FullDashboard from "./components/Dashboard/FullDashboard";
import { AuthProvider } from "./services/AuthProvider";
import { ErrorProvider } from "./services/ErrorProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBanner from "./components/elements/ErrorBanner";
import SearchComponent from "./components/Search/Search";
import HomePage from "./components/Home/HomePage";
function App() {
  return (
    <ErrorProvider>
      <AuthProvider>
        <BrowserRouter>
          <Nav></Nav>
          <div className="App">
            <ErrorBanner />
            <Routes>
              <Route index element={<HomePage />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/status" element={<Status />} />

              <Route
                path="/explorer"
                element={
                  <ProtectedRoute>
                    <SearchComponent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <FullDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ErrorProvider>
  );
}

export default App;
