import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import VenuePage from "./pages/VenuePage";
import VenueCalendarPage from "./pages/VenueCalendarPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import ManagerPage from "./pages/ManagerPage";
import CreateVenuePage from "./pages/CreateVenuePage";
import EditVenuePage from "./pages/EditVenuePage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <BrowserRouter>
      <main className="min-h-screen bg-stone-50 text-stone-900">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/venues/:id" element={<VenuePage />} />
          <Route path="/venues/:id/calendar" element={<VenueCalendarPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/manager" element={<ManagerPage />} />
          <Route path="/manager/venues/new" element={<CreateVenuePage />} />
          <Route path="/manager/venues/:id/edit" element={<EditVenuePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;