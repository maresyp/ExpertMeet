import './App.css';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Header from './components/Header';
import PrivateRoutes from './utils/PrivateRoutes';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route element={<HomePage />} exact path='/' />
          </Route>
          <Route element={<LoginPage />} path='/login' />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
