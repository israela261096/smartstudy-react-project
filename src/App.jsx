import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./view/components/Navbar/Navbar";
import './App.css';

import Loginpage from "./view/pages/Loginpage/Loginpage";
import Registerpage from "./view/pages/Registerpage/Registerpage";
import Dashboardpage from "./view/pages/Dashboardpage/Dashboardpage";
import Taskspage from "./view/pages/Taskspage/Taskspage";
import Summariespage from "./view/pages/Summariespage/Summariespage";
import Forumspage from "./view/pages/Forumspage/Forumspage";
import Supportpage from "./view/pages/Supportpage/Supportpage";
import Profilepage from "./view/pages/Profilepage/Profilepage";
import Adminpage from "./view/pages/Adminpage/Adminpage";
import Homepage from "./view/pages/Homepage/Homepage";

function App() {
  return (
    <Router>
      <div className="page-container">

        <div className="top-section">
          <div className="logo">
            SmartStudy <span className="circle">S</span>
          </div>

          <Navbar />
        </div>

        <header className="header">
          <div className="main-content">
            <main className="main">
              <Routes>
                <Route path="/loginpage" element={<Loginpage />} />
                <Route path="/registerpage" element={<Registerpage />} />
                <Route path="/dashboardpage" element={<Dashboardpage />} />
                <Route path="/taskspage" element={<Taskspage />} />
                <Route path="/summariespage" element={<Summariespage />} />
                <Route path="/forumspage" element={<Forumspage />} />
                <Route path="/supportpage" element={<Supportpage />} />
                <Route path="/profilepage" element={<Profilepage />} />
                <Route path="/adminpage" element={<Adminpage />} />
                <Route path="/homepage" element={<Homepage />} />
              </Routes>
            </main>
          </div>
        </header>

        <footer className="footer">
          © 2025 SmartStudy | כל הזכויות שמורות
        </footer>

      </div>
    </Router>
  );
}

export default App;