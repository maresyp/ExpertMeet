import './App.css';
import HomePage from './pages/HomePage';
import Header from './components/Header';
import PrivateRoutes from './utils/PrivateRoutes';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import SignIn from './pages/SignIn';
import AuthRoutes from './utils/AuthRoutes';
import SignUp from './pages/SignUp';
import { AlertProvider } from './context/AlertContext';

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <AlertProvider>
            <Header />
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
            </Routes>
          </AlertProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
