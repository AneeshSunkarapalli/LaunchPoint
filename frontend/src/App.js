import React from 'react';
import './App.css'; // Import global styles
import SearchBar from './components/SearchBar'; // Import the SearchBar component
import Rating from './components/Rating'; // Import the PropertyResults component
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'; // Import React Router components
import { Button } from 'react-bootstrap'; // Import Button from Bootstrap

// Custom Header component that changes based on route
const Header = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <header className="app-header" style={{ color: isHomePage ? '#fff' : '#000' }}>
      <div className="app-logo" style={{ color: isHomePage ? '#fff' : '#000' }}>LaunchPoint</div>
      <div className="app-sign-in">
        <Button variant="outline-light" style={{ color: isHomePage ? '#fff' : '#000', borderColor: isHomePage ? '#fff' : '#000' }}>
          Register/Sign In
        </Button>
      </div>
    </header>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        {/* Header with dynamic color */}
        <Header />

        {/* Define Routes for your app */}
        <Routes>
          {/* Home route - displays the search bar */}
          <Route
            path="/"
            element={
              <div className="background-overlay">
                <div className="motto">
                  <h2>The starting point for launching your business.</h2>
                </div>

                {/* Search bar container */}
                <div className="search-bar-container">
                  <SearchBar />
                </div>
              </div>
            }
          />

          {/* Results route - displays the results page */}
          <Route path="/results" element={<Rating />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
