import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from "react-router-dom";

import Navbar from "./view/components/Navbar/Navbar";


import Adminpage from "./view/pages/Adminpage/Adminpage";
import Dashboardpage from "./view/pages/Dashboardpage/Dashboardpage";
import ForumsPage from "./view/pages/Forumspage/Forumspage";
import HomePage from "./view/pages/Homepage/Homepage";
import LoginPage from "./view/pages/Loginpage/Loginpage";
import RegisterPage from "./view/pages/Registerpage/Registerpage";
import SettingsPage from "./view/pages/Settingspage/Settingspage";
import SummariesPage from "./view/pages/Summariespage/Summariespage";
import SupportPage from "./view/pages/Supportpage/Supportpage";

function AppWrapper() {
  const location = useLocation();


  const noNavbarPaths = ["/", "/login", "/register"];
  const shouldShowNavbar = !noNavbarPaths.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/summaries" element={<SummariesPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/Settings" element={<SettingsPage />} />
        <Route path="/forums" element={<ForumsPage />} />
        <Route path="/dashboard" element={<Dashboardpage />} />
        <Route path="/Adminpage" element={<Adminpage />} />

        <Route path="*" element={<LoginPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;