import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register/Register";
import NotFound from "./pages/NotFound/NotFound";
import Tickets from "./pages/Tickets/Tickets";
import Ticket from "./pages/Tickets/Edit/TicketEdit";
import Users from "./pages/Users/Users";
import Profile from "./pages/Profile/Profile";
import Tables from "./pages/Tables/Tables";

export default function App(){

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/tickets" element={<Tickets />} />
        <Route path="/ticket" element={<Ticket />} />
        <Route path="/ticket/:id" element={<Ticket />} />

        <Route path="/users" element={<Users />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/tables" element={<Tables />} />
        {/* Redirect to NotFound for any unmatched routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};
