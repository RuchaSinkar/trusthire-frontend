import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './hooks/useAuth.jsx';
import Navbar    from './components/Navbar';
import Home      from './pages/Home';
import Login     from './pages/Login';
import Register  from './pages/Register';
import Reports   from './pages/Reports';
import NewReport from './pages/NewReport';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/login"      element={<Login />} />
          <Route path="/register"   element={<Register />} />
          <Route path="/reports"    element={<Reports />} />
          <Route path="/report/new" element={<NewReport />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}