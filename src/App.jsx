import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./sections/Navbar";
import Home from "./sections/Home";
import Scheduler from "./sections/Scheduler";
import Login from "./sections/Login";
import Signup from "./sections/Signup";
import { Navigate } from "react-router-dom";
import Profile from "./sections/Profile";
import Appointment from "./sections/Appointment";
import userpool from "./userpool";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const user = userpool.getCurrentUser();
    if (user) {
      user.getSession((err, session) => {
        if (err) {
          console.error("Error getting user session:", err);
          return;
        }

        // Get user attributes
        user.getUserAttributes((err, attributes) => {
          if (err) {
            console.error("Error getting user attributes:", err);
            return;
          }

          // Convert attributes to an object for easy access
          const attributesObj = {};
          attributes.forEach(attr => {
            attributesObj[attr.Name] = attr.Value;
          });

          console.log("User attributes:", attributesObj);

          // Store role and login status in localStorage
          localStorage.setItem("isLogin", "true");
          localStorage.setItem("role", attributesObj["custom:role"]);
        });
      });
    } else {
      localStorage.setItem("isLogin", "false");
      localStorage.removeItem("role");
    }
  }, []);

  return (
    <Router>
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <main className="flex-grow max-w-[150rem] mx-auto relative">
      <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/"
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
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["surgeon"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointment"
              element={
                <ProtectedRoute allowedRoles={["surgeon"]}>
                  <Appointment />
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
