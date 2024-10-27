import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./sections/Navbar";
import Home from "./sections/Home";
import Scheduler from "./sections/Scheduler";
import Login from "./sections/Login";
import { Navigate } from "react-router-dom";

function App() {

  return (
    <Router>
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <main className="flex-grow max-w-[150rem] mx-auto relative">
      <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute allowedRoles={["scheduler", "surgeon"]}>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/scheduler"
              element={
                <ProtectedRoute allowedRoles={["scheduler"]}>
                  <Scheduler />
                </ProtectedRoute>
              }
            />
          </Routes>
      </main>
    </div>
  </Router>
  )
}

export default App

const ProtectedRoute = ({ children, allowedRoles }) => {
  const isLogin = localStorage.getItem("isLogin") === "true";
  const userRole = localStorage.getItem("role");

  if (!isLogin) {
    // If not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // If role doesn't match, redirect to home page
    return <Navigate to="/home" replace />;
  }

  // If role matches, render the component
  return children;
};
