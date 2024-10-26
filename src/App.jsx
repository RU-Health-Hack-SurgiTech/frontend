import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./sections/Navbar";
import Home from "./sections/Home";
import Scheduler from "./sections/Scheduler";

function App() {

  return (
    <Router>
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <main className="flex-grow max-w-[150rem] mx-auto relative">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/scheduler" element={<Scheduler />} />
          {/* <Route path="/leagues/:leagueId/:seasonYear" element={<LeagueDetails />} />
          <Route path="/teams/:teamId/:leagueId/:seasonYear" element={<TeamDetails />} /> */}
        </Routes>
      </main>
    </div>
  </Router>
  )
}

export default App
