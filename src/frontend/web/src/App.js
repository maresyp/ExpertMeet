import './App.css';
import HomePage from './pages/HomePage';
import Header from './components/Header';
import PrivateRoutes from './utils/PrivateRoutes';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import SignIn from './pages/SignIn';
import AuthRoutes from './utils/AuthRoutes';

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Header />
          <Routes>
            <Route element={<HomePage />} exact path='/' />
            <Route element={<AuthRoutes />}>
              {/* Login / Register */}
              <Route element={<SignIn />} path='/login' />
            </Route>
            <Route element={<PrivateRoutes />}>
              {/* Private routes */}
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
