import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import ChatPage from './pages/ChatPage'
import VolunteerPage from './pages/VolunteerPage'
import InternshipPage from './pages/InternshipPage'
import EventsPage from './pages/EventsPage'
import ContactPage from './pages/ContactPage'
import AdminPage from './pages/AdminPage'
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/volunteer" element={<VolunteerPage />} />
      <Route path="/internship" element={<InternshipPage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
