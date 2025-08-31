import React from 'react';
// import LandingPage from './components/LandingPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SearchInterface } from './components/SearchInterface';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* 暂时 注释 LandingPage */}
          {/* <Route path="/" element={<LandingPage />} /> */}
          <Route path="/" element={<SearchInterface />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
