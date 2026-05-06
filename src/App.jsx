import Dashboard from './pages/Dashboard'
import { Route, Routes } from 'react-router-dom'
import Default from './components/Default'
import Applications from './pages/Applications'
import AddJob from './pages/AddJob'
import Analytics from './pages/Analytics'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Notifications from './pages/Notifications'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Default />}>
        <Route index element={<Dashboard />} />
        <Route path="applications" element={<Applications />} />
        <Route path="add-job" element={<AddJob />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>
    </Routes>
  )
}

export default App