import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SettingsPage from './pages/SettingsPage'
import NewEntryPage from './pages/NewEntryPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/new" element={<NewEntryPage />} />
      </Routes>
    </BrowserRouter>
  )
}
