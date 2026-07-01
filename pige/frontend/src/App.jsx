import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Registration from "./pages/Registration";
import Login from "./pages/admin/Login";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import StudentsList from "./pages/admin/StudentsList";
import ProgramsList from "./pages/admin/ProgramsList";
import DirectoratesList from "./pages/admin/DirectoratesList";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="students" element={<StudentsList />} />
        <Route path="programs" element={<ProgramsList />} />
        <Route path="directorates" element={<DirectoratesList />} />
      </Route>
    </Routes>
  );
}

