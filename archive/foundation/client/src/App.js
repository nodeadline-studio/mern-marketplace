import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import HomePage from './pages/Home';
import LoginPage from './pages/Auth/Login';
import RegisterPage from './pages/Auth/Register';
import ServiceListPage from './pages/Services/List';
import ServiceDetailPage from './pages/Services/Detail';
import UserProfilePage from './pages/Users/Profile';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/auth/PrivateRoute';
import './styles/main.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/services" element={<ServiceListPage />} />
                <Route path="/services/:id" element={<ServiceDetailPage />} />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <UserProfilePage />
                    </PrivateRoute>
                  }
                />
                {/* Add more routes as needed */}
              </Routes>
            </Layout>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;