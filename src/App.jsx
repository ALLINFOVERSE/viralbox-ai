import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from './context/AppContext.jsx'
import Layout from './components/Layout.jsx'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import CeoCabin from './pages/CeoCabin.jsx'
import Agents from './pages/Agents.jsx'
import Pricing from './pages/Pricing.jsx'
import Admin from './pages/Admin.jsx'

function Protected({ children }) {
  const { user } = useApp()
  return user ? children : <Navigate to="/login" />
}

function AdminRoute({ children }) {
  const { user } = useApp()
  return user?.isAdmin ? children : <Navigate to="/" />
}

export default function App() {
  const { user } = useApp()
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"        element={<Landing />} />
        <Route path="/login"   element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/pricing" element={<Pricing />} />

        {/* Protected — user pages */}
        <Route path="/dashboard" element={<Protected><Layout><Dashboard /></Layout></Protected>} />
        <Route path="/ceo-cabin" element={<Protected><Layout><CeoCabin /></Layout></Protected>} />
        <Route path="/agents"    element={<Protected><Layout><Agents /></Layout></Protected>} />

        {/* Admin only */}
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
