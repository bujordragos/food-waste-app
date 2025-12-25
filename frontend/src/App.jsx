import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Explore from './pages/Explore';
import Groups from './pages/Groups';
import Profile from './pages/Profile';
import Layout from './components/Layout';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

function App() {
  React.useEffect(() => {
    // global theme check
    const isDark = localStorage.getItem('theme') === 'dark';
    if (isDark) document.body.classList.add('dark');
  }, []);

  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />

          <Route 
            path="/explore" 
            element={
              <PrivateRoute>
                <Explore />
              </PrivateRoute>
            } 
          />

          <Route 
            path="/groups" 
            element={
              <PrivateRoute>
                <Groups />
              </PrivateRoute>
            } 
          />

          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } 
          />

          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
