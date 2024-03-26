import './App.css';
import HomePage from './pages/HomePage';
import PrivateRoutes from './utils/PrivateRoutes';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import SignIn from './pages/SignIn';
import AuthRoutes from './utils/AuthRoutes';
import SignUp from './pages/SignUp';
import { AlertProvider } from './context/AlertContext';
import NavBar from './components/navbar/NavBar';
import React from 'react';
import MyProfile from './pages/MyProfile';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client for web requests
const queryClient = new QueryClient();

function App() {
  return (
    <React.StrictMode>
    <div className="App">
      <Router>
        <AuthProvider>
          <AlertProvider>
              <QueryClientProvider client={queryClient}>
                <NavBar />
                <Routes>
                  <Route element={<HomePage />} exact path='/' />
                  <Route element={<AuthRoutes />}>
                    {/* Login / Register */}
                    <Route element={<SignIn />} path='/login' />
                    <Route element={<SignUp />} path='/register' />
                  </Route>
                  <Route element={<PrivateRoutes />}>
                    {/* Private routes */}
                    <Route element={<MyProfile />} path='/profile' />
                  </Route>
                  {/* Fallback route */}
                  <Route path="*" element={<HomePage />} />
                </Routes>
              </QueryClientProvider>
          </AlertProvider>
        </AuthProvider>
      </Router>
    </div>
    </React.StrictMode>
  );
}

export default App;
