import './App.css';
import HomePage from './pages/HomePage';
import PrivateRoutes from './utils/PrivateRoutes';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import SignIn from './pages/SignIn';
import AuthRoutes from './utils/AuthRoutes';
import SignUp from './pages/SignUp';
import { AlertProvider } from './context/AlertContext';
import NavBar from './components/NavBar';

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <AlertProvider>
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
              </Route>
              {/* Fallback route */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </AlertProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
