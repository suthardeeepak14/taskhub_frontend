import { Routes, Route, Outlet } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProjectsPage from "./pages/ProjectsPage";
import NewProjectPage from "./pages/NewProjectPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ProjectTasksPage from "./pages/ProjectTasksPage";
import TaskDetailPage from "./pages/TaskDetailPage";
import NewTaskPage from "./pages/NewTaskPage";
import EditProjectPage from "./pages/EditProjectPage";
import EditTaskPage from "./pages/EditTaskPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route
        element={
          <ProtectedRoute>
            <Outlet />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/new" element={<NewProjectPage />} />
        <Route
          path="/projects/:projectId/tasks/new"
          element={<NewTaskPage />}
        />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/projects/:id/tasks" element={<ProjectTasksPage />} />
        <Route
          path="/projects/:id/tasks/:taskId"
          element={<TaskDetailPage />}
        />
        <Route path="/projects/:id/edit" element={<EditProjectPage />} />
        <Route
          path="/projects/:id/tasks/:taskId/edit"
          element={<EditTaskPage />}
        />
      </Route>
    </Routes>
  );
}

export default App;
